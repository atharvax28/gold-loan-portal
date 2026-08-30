/**
 * Static catalog of available loan plans. Each plan's maxLtvPercent must
 * never exceed config.regulatoryMaxLtvPercent (75%).
 */
const LOAN_SCHEMES = [
  {
    planId: 'PLAN_BULLET_01',
    name: 'Bullet Repayment Plan',
    description: 'Pay interest at maturity or periodically; repay the full principal in one bullet payment at tenure end.',
    baseInterestRatePercent: 12.5,
    maxLtvPercent: 75,
    tenureMonths: 12,
  },
  {
    planId: 'PLAN_EMI_01',
    name: 'Monthly EMI Plan',
    description: 'Repay principal and interest through fixed monthly installments over the tenure.',
    baseInterestRatePercent: 10.5,
    maxLtvPercent: 70,
    tenureMonths: 24,
  },
];

function getLoanSchemes() {
  return LOAN_SCHEMES;
}

function getSchemeById(planId) {
  return LOAN_SCHEMES.find((scheme) => scheme.planId === planId);
}

module.exports = {
  getLoanSchemes,
  getSchemeById,
};
