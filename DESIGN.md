# Yellow Metal — Gold Loan Portal

## Mission
Create implementation-ready, token-driven UI guidance for the Yellow Metal gold loan lead-intake
portal that is optimized for trust, clarity of financial figures, and fast, accurate completion of
a 3-step application flow.

## Brand
- Product/brand: Yellow Metal (RBI-licensed NBFC, gold loan lending)
- Audience: prospective borrowers and lending partners submitting/reviewing leads
- Product surface: lead-intake web app (multi-step form + calculator + admin/partner dashboard)

## Style Foundations
Derived via `ui-ux-pro-max` (style: Minimalism & Swiss Style; color: Luxury/Premium Brand;
typography: Financial Trust).

- Visual style: Minimalism & Swiss Style — clean, functional, high-contrast, grid-based, low
  ornamentation, hierarchy from type weight and spacing rather than decoration. A gold lender
  should read as *disciplined and trustworthy*, not flashy.
- Font: `font.family.primary=IBM Plex Sans`, `font.family.stack=IBM Plex Sans, system-ui, sans-serif`
  — chosen because it reads as financial/banking/trustworthy and has strong tabular figures for
  currency and weight data.
- Color palette (`Luxury/Premium Brand` — literal black+gold+white fit for a gold lender):
  - `color.text.primary=#0C0A09`
  - `color.text.secondary=#44403C`
  - `color.surface.base=#FFFFFF`
  - `color.bg=#FAFAF9`
  - `color.border.default=#D6D3D1`
  - `color.primary=#1C1917` (ink — primary buttons, active nav, headings emphasis)
  - `color.accent.gold=#CA8A04` (selected states, links, focus rings, highlight tiles, brand mark)
  - `color.accent.gold-tint=#FBF0D9` (highlighted tile backgrounds — never body text on this alone)
  - `color.success=#15803D` / `color.success-bg=#F0FDF4`
  - `color.error=#B91C1C` / `color.error-bg=#FEF2F2`
- Spacing scale: 4 / 8 / 12 / 16 / 20 / 24 / 32 / 48px (Swiss modular rhythm).
- Radius/shadow/motion: `radius.sm=6px`, `radius.md=10px` (crisp, not soft/glassy);
  `shadow.card=0 1px 2px rgba(12,10,9,0.06), 0 1px 0 rgba(12,10,9,0.04)` (flat, minimal — no glow,
  no glassmorphism); `motion.duration=180ms` ease for hover/focus, disabled under
  `prefers-reduced-motion`.

## Accessibility
- Target: WCAG 2.2 AA.
- `#CA8A04` gold fails AA for text/icons on white and for white text on gold background — gold is
  used only for accents, borders, tints, and large/bold emphasis numerals, never as the sole
  foreground color for body text or as a button fill with white text on top.
- Every form error is exposed via `role="alert"` (not color alone).
- Focus-visible rings required on every interactive element (buttons, inputs, selectable cards).
- Touch targets ≥ 44×44px.
- `prefers-reduced-motion` respected — transitions collapse to near-instant.

## Writing Tone
Concise, plain-language, numerate — this app's job is to get a correct number in front of the
user fast, not to persuade.

## Rules: Do
- Use semantic tokens above, not one-off hex values, in component code.
- Every interactive component defines default / hover / focus-visible / active / disabled states.
- Currency and weight values use tabular figures and consistent formatting everywhere.
- Errors appear inline, next to the field, and are screen-reader announced.
- Icons are inline SVG (checkmark, brand mark) — no emoji glyphs as UI icons.

## Rules: Don't
- Don't put white text on the gold accent color (contrast fails AA).
- Don't use gold as a large background fill for text-bearing surfaces.
- Don't introduce a second accent color — gold is the only accent.
- Don't ship a component without a visible focus state.

## Component Rule Expectations
- **Buttons:** primary = ink (`#1C1917`) fill / white text (contrast ~19.5:1); secondary = white
  fill / ink border+text; both get a 2px gold focus-visible ring.
- **Selected scheme card:** ink border + gold-tint background + gold-deep amount text, not a gold
  fill.
- **Step indicator "done":** ink-filled circle with a white SVG checkmark (not a colored emoji
  checkmark).
- **Admin table:** zebra-free, thin `border.default` row dividers, tabular-nums for currency/weight
  columns so figures align.
- **Error text:** `color.error` text + `role="alert"`, never color-only.

## QA Checklist
- [ ] No emoji icons — SVG only
- [ ] Gold never used as text-on-gold or white-on-gold
- [ ] All interactive elements have a visible focus ring
- [ ] All error messages have `role="alert"`
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive at 375 / 768 / 1024 / 1440px, no horizontal scroll outside the admin table
- [ ] Currency/weight columns use tabular numerals
