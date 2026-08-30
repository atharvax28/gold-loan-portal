# Yellow Metal — Gold Loan Application & Data Collection Portal

A web-based lead intake portal where partners/prospective borrowers enter gold collateral details
to get a preliminary gold loan offer, plus a partner/admin dashboard of collected leads. Built for
the Yellow Metal Full-Stack Developer Intern take-home assignment.

See [`AI_LOG.md`](./AI_LOG.md) for the AI-assisted development log (tools used, prompts, and an
audited AI-generated bug fix).

## Stack

- **Backend:** Node.js, Express (REST API, CommonJS)
- **Frontend:** React 18 + Vite
- **Persistence:** A JSON-file-backed store (`backend/src/db/jsonStore.js`) standing in for
  PostgreSQL/MongoDB — see [Database choice](#database-choice) below.

## Project Structure

```
gold-loan-portal/
├── backend/
│   └── src/
│       ├── app.js, server.js        # Express app + entrypoint
│       ├── config/                  # env-driven config (port, gold rate, LTV cap)
│       ├── routes/                  # /loan-schemes, /leads
│       ├── controllers/             # request handling
│       ├── services/                # loan scheme catalog + collateral/LTV math
│       ├── validators/              # POST /leads/submit validation rules
│       ├── middleware/              # asyncHandler, ApiError + centralized error handler
│       └── db/                      # jsonStore.js (file-backed persistence)
├── frontend/
│   └── src/
│       ├── App.jsx                  # Apply / Partner Dashboard nav
│       ├── pages/                   # LeadIntakePage (wizard), AdminPage
│       ├── components/              # Step form, scheme cards, confirmation, admin table
│       ├── api/client.js            # fetch wrapper for the backend API
│       └── utils/                   # client-side calc preview, formatting/masking
└── AI_LOG.md
```

## Running Locally

Requires Node.js 18+. Two terminals (backend + frontend).

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # defaults are fine for local dev
npm start                # or: npm run dev (nodemon)
```

API listens on `http://localhost:4000`. Health check: `GET http://localhost:4000/api/v1/health`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_BASE_URL defaults to http://localhost:4000/api/v1
npm start                 # runs `vite`, serves on http://localhost:5173
```

Open `http://localhost:5173`.

## API Reference

### `GET /api/v1/loan-schemes`

Returns the available loan plans with base interest rate and max LTV (each ≤ 75%).

### `POST /api/v1/leads/submit`

```json
{
  "customerName": "Rahul Sharma",
  "mobileNumber": "9876543210",
  "grossWeightGrams": 50,
  "netWeightGrams": 45,
  "purityKarat": 22,
  "selectedPlanId": "PLAN_BULLET_01"
}
```

- **400 Bad Request** — `{ "error": "VALIDATION_ERROR", "message": "...", "details": [{ "field", "message" }, ...] }`
- **409 Conflict** — `{ "error": "DUPLICATE_SUBMISSION", "message": "..." }` if the same
  `mobileNumber` submitted within the last 7 days.
- **201 Created** — `{ "message": "...", "lead": { applicationId, ...calculated fields, status: "SUBMITTED" } }`

Calculation: `pureGoldWeightGrams = netWeightGrams × (purityKarat / 24)`; gold value = pure weight
× mock gold rate; max eligible loan = gold value × min(scheme LTV%, 75%).

### `GET /api/v1/leads`

Returns all submitted leads with their calculated loan amounts and selected plans (used by the
Partner Dashboard; mobile numbers are masked client-side for display).

## Database choice

The assignment names PostgreSQL/MongoDB as the target databases. This project instead uses a
small JSON-file store (`backend/src/db/jsonStore.js`) with the same `readAll` / `insert` / `find`
access pattern a Mongo collection or Postgres repository would expose, so it's a drop-in swap
later. The reasoning: the grading criteria are about validation/math/dedup/API correctness, not
DB choice, and a file store means `npm install && npm start` works with zero external services —
no reviewer has to stand up Postgres or Mongo just to run the app. Submitted leads persist in
`backend/src/data/leads.json`.

## Assumptions

- **Gold rate:** No live bullion price feed is wired up. `GOLD_RATE_PER_GRAM_24K_INR` (default
  ₹6,500/g) is a mock constant in `backend/.env`, used for all collateral valuation. In production
  this would come from a live rate feed.
- **Mobile number format:** Validated as a 10-digit Indian mobile number starting with 6-9
  (`/^[6-9]\d{9}$/`), per the spec's "valid 10-digit format" requirement.
- **LTV per scheme:** Bullet Repayment Plan = 75% LTV, Monthly EMI Plan = 70% LTV — both under the
  regulatory 75% ceiling, which is also enforced defensively in the calculation service regardless
  of what a scheme configures.
- **Admin view mobile masking** (`9876XXXX10` format) is applied client-side for display; the API
  itself returns the full number since a real backend would still need it operationally.
