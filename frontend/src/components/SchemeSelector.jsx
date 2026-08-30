import {
  computePureGoldWeightGrams,
  computeGoldMarketValueInr,
  computeMaxLoanAmountInr,
  REGULATORY_MAX_LTV_PERCENT,
} from '../utils/calculations';
import { formatInr, formatGrams } from '../utils/format';

export default function SchemeSelector({ form, onChange, onBack, onNext, schemes, loading, error }) {
  const netWeightGrams = Number(form.netWeightGrams);
  const purityKarat = Number(form.purityKarat);
  const pureGoldWeightGrams = computePureGoldWeightGrams(netWeightGrams, purityKarat);
  const goldMarketValueInr = computeGoldMarketValueInr(pureGoldWeightGrams);
  const maxEligibleLoanAmountInr = computeMaxLoanAmountInr(goldMarketValueInr, REGULATORY_MAX_LTV_PERCENT);

  return (
    <div className="card">
      <h2>Dynamic Loan Calculator</h2>

      <div className="summary-grid">
        <div className="summary-tile">
          <span className="summary-tile__label">Pure Gold Weight</span>
          <span className="summary-tile__value">{formatGrams(pureGoldWeightGrams)}</span>
        </div>
        <div className="summary-tile">
          <span className="summary-tile__label">Estimated Gold Value</span>
          <span className="summary-tile__value">{formatInr(goldMarketValueInr)}</span>
        </div>
        <div className="summary-tile summary-tile--highlight">
          <span className="summary-tile__label">Max Eligible Loan (75% LTV)</span>
          <span className="summary-tile__value">{formatInr(maxEligibleLoanAmountInr)}</span>
        </div>
      </div>

      <h3 className="section-title">Select a Loan Plan</h3>

      {loading && <p>Loading available schemes…</p>}
      {error && <p className="field-error">Could not load loan schemes: {error}</p>}

      <div className="scheme-grid">
        {schemes.map((scheme) => {
          const planLoanAmount = computeMaxLoanAmountInr(goldMarketValueInr, scheme.maxLtvPercent);
          const isSelected = form.selectedPlanId === scheme.planId;
          return (
            <button
              type="button"
              key={scheme.planId}
              className={`scheme-card ${isSelected ? 'scheme-card--selected' : ''}`}
              onClick={() => onChange({ ...form, selectedPlanId: scheme.planId })}
            >
              <span className="scheme-card__name">{scheme.name}</span>
              <span className="scheme-card__detail">Interest: {scheme.baseInterestRatePercent}% p.a.</span>
              <span className="scheme-card__detail">Max LTV: {scheme.maxLtvPercent}%</span>
              <span className="scheme-card__amount">{formatInr(planLoanAmount)}</span>
            </button>
          );
        })}
      </div>

      <div className="btn-row">
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          Back
        </button>
        <button type="button" className="btn btn-primary" disabled={!form.selectedPlanId} onClick={onNext}>
          Next: Review &amp; Submit
        </button>
      </div>
    </div>
  );
}
