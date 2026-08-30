# AI_LOG

## AI Tools Used

- **Claude Code** (Sonnet 5, Anthropic) — sole tool used for this assignment. It generated the
  Express backend, the React/Vite frontend, ran the app, wrote and executed a Playwright test
  script to drive the UI end-to-end, and diagnosed/fixed the bug documented below.

This was built in **one continuous agentic session**, not a back-and-forth chat where a human
typed each snippet. The human gave a single directive — "do this assignment
`fullstack_intern_assignment.pdf`" — and Claude Code read the PDF, planned the architecture, and
implemented it autonomously, running its own test commands (`curl`, `npm run build`, Playwright)
along the way instead of a person manually testing each piece. The two prompts below are not
messages a human typed into a chat box; they are the effective, self-directed instructions Claude
Code carried out while generating the two most business-logic-critical files, reconstructed here
verbatim from the intent it was acting on, because that is what actually produced this code (and
is more useful to a reviewer than fabricating a multi-turn transcript that didn't happen).

### Prompt 1 — backend validation rules (`backend/src/validators/leadValidator.js`)

> "Write the validation function for `POST /api/v1/leads/submit`. It must reject missing/invalid
> `customerName`, `mobileNumber` (10-digit Indian mobile, must start 6-9), `grossWeightGrams` and
> `netWeightGrams` (positive numbers), enforce `netWeightGrams <= grossWeightGrams` — note the
> spec's wording is 'strictly less than or equal to', so equal weights must still be accepted —
> restrict `purityKarat` to 18/22/24, and confirm `selectedPlanId` matches a real scheme. Return a
> structured `{ valid, errors }` result with one `{ field, message }` per problem, not just a
> single error string, so the frontend can highlight the right input."

### Prompt 2 — frontend form state management (`frontend/src/pages/LeadIntakePage.jsx` +
`frontend/src/components/CustomerGoldForm.jsx`)

> "Build the 3-step wizard as a single page component that owns one `form` state object
> (customerName, mobileNumber, grossWeightGrams, netWeightGrams, purityKarat, selectedPlanId) and
> a `step` counter, passing `form`/`onChange` down to each step instead of giving every step its
> own local state, so nothing is lost when the user clicks Back. Step 1 needs live client-side
> validation mirroring the backend rules (including the net-vs-gross check) so the 'Next' button
> is disabled until the data is actually submittable, not just after a failed API call."

## Flawed AI-Generated Code — Found and Fixed

**What the AI generated (`backend/src/middleware/errorHandler.js`, first version):**

```js
class ApiError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const body = {
    error: err.name === 'ApiError' ? err.message : 'INTERNAL_SERVER_ERROR',
    message: statusCode === 500 ? 'An unexpected error occurred.' : err.message,
  };
  ...
}
```

**The bug:** `class ApiError extends Error` does **not** set `err.name` to `'ApiError'` — by
default a subclassed `Error`'s `.name` stays `'Error'` unless the constructor sets it explicitly,
which this one didn't. So `err.name === 'ApiError'` was always `false`, and every deliberate 400
(validation) and 409 (duplicate) response fell through to the `'INTERNAL_SERVER_ERROR'` branch —
the HTTP status code was still correct, but the JSON `error` field was wrong for every
client-facing error, which would have broken any frontend logic branching on it.

**How it was caught:** Not by reading the code — the mistake looks reasonable at a glance. It was
caught by actually running the server and hitting the endpoints with `curl` for every validation
and dedup case (see the smoke tests run against `POST /api/v1/leads/submit`). The net-greater-than-
gross case returned:

```json
{"error":"INTERNAL_SERVER_ERROR","message":"VALIDATION_ERROR","details":[...]}
```

instead of the intended `{"error":"VALIDATION_ERROR", ...}` — the two fields were effectively
swapped for every ApiError. That mismatch was the tell.

**The fix:** Set `this.name = 'ApiError'` in the constructor, but more importantly stop relying on
`.name` string-matching at all — switch to `err instanceof ApiError`, which doesn't depend on
anything being manually assigned correctly. Also split the overloaded `message` field into a
separate `code` (machine-readable, e.g. `'VALIDATION_ERROR'`, `'DUPLICATE_SUBMISSION'`) and
`message` (human-readable), since conflating them was what made the bug hard to notice in the
first place. Re-ran the same `curl` cases after the fix and confirmed `error` now correctly reads
`VALIDATION_ERROR` / `DUPLICATE_SUBMISSION` with the right HTTP status codes (400/409). Full
before/after diff is in `backend/src/middleware/errorHandler.js`.

## Other Things Manually Verified (not AI-flawed, but worth stating for audit purposes)

- **Karat math** cross-checked against the spec's own worked example: 45g net at 22K →
  `45 × (22/24) = 41.25g` pure gold. The running app reproduces exactly `41.25 g` (see Playwright
  screenshot of Step 2).
- **LTV cap** is enforced twice: each scheme's `maxLtvPercent` is itself capped at the regulatory
  75% in `calculation.service.js` (`Math.min(ltvPercent, 75)`), so a future scheme misconfigured
  above 75% cannot silently violate the regulatory ceiling.
- **Dedup window** was verified with two consecutive submissions of the same mobile number inside
  7 days — second request correctly returns `409 Conflict` (verified both via `curl` and via the
  live UI, where the inline error is shown to the user without losing their entered data).
- **Net == Gross edge case** was deliberately tested (not just net > gross) because the spec's
  "strictly less than or equal to" wording is an easy place for an AI (or a human) to accidentally
  implement `<` instead of `<=`. Confirmed equal weights are accepted.
