const config = require('../config');

function round2(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * pureGoldWeight = netWeight x (purityKarat / 24)
 * e.g. 45g net weight at 22K => 45 * (22/24) = 41.25g pure gold
 */
function computePureGoldWeightGrams(netWeightGrams, purityKarat) {
  return round2(netWeightGrams * (purityKarat / 24));
}

function computeGoldMarketValueInr(pureGoldWeightGrams, goldRatePerGram24kInr = config.goldRatePerGram24kInr) {
  return round2(pureGoldWeightGrams * goldRatePerGram24kInr);
}

/**
 * Max eligible loan = gold market value x (LTV cap / 100), capped at the
 * regulatory ceiling regardless of what a scheme configures.
 */
function computeMaxLoanAmountInr(goldMarketValueInr, ltvPercent) {
  const effectiveLtv = Math.min(ltvPercent, config.regulatoryMaxLtvPercent);
  return round2(goldMarketValueInr * (effectiveLtv / 100));
}

function buildCollateralSummary({ netWeightGrams, purityKarat, goldRatePerGram24kInr }) {
  const pureGoldWeightGrams = computePureGoldWeightGrams(netWeightGrams, purityKarat);
  const goldMarketValueInr = computeGoldMarketValueInr(pureGoldWeightGrams, goldRatePerGram24kInr);
  const maxEligibleLoanAmountInr = computeMaxLoanAmountInr(goldMarketValueInr, config.regulatoryMaxLtvPercent);

  return {
    pureGoldWeightGrams,
    goldRatePerGram24kInr: goldRatePerGram24kInr ?? config.goldRatePerGram24kInr,
    goldMarketValueInr,
    maxEligibleLoanAmountInr,
  };
}

module.exports = {
  computePureGoldWeightGrams,
  computeGoldMarketValueInr,
  computeMaxLoanAmountInr,
  buildCollateralSummary,
  round2,
};
