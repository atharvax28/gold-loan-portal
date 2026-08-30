/**
 * Client-side mirror of the backend calculation logic, used only to render
 * an instant preview in Step 2. The authoritative numbers are always the
 * ones returned by POST /leads/submit.
 *
 * NOTE: GOLD_RATE_PER_GRAM_24K_INR must match the backend's
 * GOLD_RATE_PER_GRAM_24K_INR env value (see backend/.env.example) for the
 * preview to agree with the final submitted amount.
 */
export const GOLD_RATE_PER_GRAM_24K_INR = 6500;
export const REGULATORY_MAX_LTV_PERCENT = 75;

function round2(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function computePureGoldWeightGrams(netWeightGrams, purityKarat) {
  if (!netWeightGrams || !purityKarat) return 0;
  return round2(netWeightGrams * (purityKarat / 24));
}

export function computeGoldMarketValueInr(pureGoldWeightGrams) {
  return round2(pureGoldWeightGrams * GOLD_RATE_PER_GRAM_24K_INR);
}

export function computeMaxLoanAmountInr(goldMarketValueInr, ltvPercent = REGULATORY_MAX_LTV_PERCENT) {
  const effectiveLtv = Math.min(ltvPercent, REGULATORY_MAX_LTV_PERCENT);
  return round2(goldMarketValueInr * (effectiveLtv / 100));
}
