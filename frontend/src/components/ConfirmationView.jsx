import { useState } from 'react';
import { submitLead } from '../api/client';
import { formatInr, formatGrams } from '../utils/format';
import { CheckIcon } from './icons';

export default function ConfirmationView({ form, schemes, onBack, onSubmitted, submittedLead }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const selectedScheme = schemes.find((s) => s.planId === form.selectedPlanId);

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        customerName: form.customerName.trim(),
        mobileNumber: form.mobileNumber.trim(),
        grossWeightGrams: Number(form.grossWeightGrams),
        netWeightGrams: Number(form.netWeightGrams),
        purityKarat: Number(form.purityKarat),
        selectedPlanId: form.selectedPlanId,
      };
      const result = await submitLead(payload);
      onSubmitted(result.lead);
    } catch (err) {
      if (err.status === 409) {
        setError('A loan application for this mobile number was already submitted within the last 7 days.');
      } else if (err.status === 400) {
        const details = err.payload?.details;
        const detailText = Array.isArray(details) ? details.map((d) => d.message).join(' ') : '';
        setError(`Please fix the following and try again: ${detailText || err.message}`);
      } else {
        setError(err.message || 'Something went wrong while submitting your application.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (submittedLead) {
    return (
      <div className="card confirmation">
        <div className="confirmation__badge">
          <CheckIcon size={24} />
        </div>
        <h2>Application Submitted</h2>
        <p className="confirmation__subtitle">
          Your preliminary gold loan offer has been recorded. Our team will reach out to complete verification.
        </p>
        <div className="confirmation__id">
          Application ID
          <code>{submittedLead.applicationId}</code>
        </div>
        <div className="summary-grid">
          <div className="summary-tile">
            <span className="summary-tile__label">Pure Gold Weight</span>
            <span className="summary-tile__value">{formatGrams(submittedLead.pureGoldWeightGrams)}</span>
          </div>
          <div className="summary-tile summary-tile--highlight">
            <span className="summary-tile__label">Approved Loan Amount</span>
            <span className="summary-tile__value">{formatInr(submittedLead.calculatedLoanAmountInr)}</span>
          </div>
          <div className="summary-tile">
            <span className="summary-tile__label">Plan</span>
            <span className="summary-tile__value">{submittedLead.selectedPlanName}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Review &amp; Submit</h2>

      <dl className="review-list">
        <div className="review-list__row">
          <dt>Customer Name</dt>
          <dd>{form.customerName}</dd>
        </div>
        <div className="review-list__row">
          <dt>Mobile Number</dt>
          <dd>{form.mobileNumber}</dd>
        </div>
        <div className="review-list__row">
          <dt>Gross / Net Weight</dt>
          <dd>
            {form.grossWeightGrams} g / {form.netWeightGrams} g
          </dd>
        </div>
        <div className="review-list__row">
          <dt>Purity</dt>
          <dd>{form.purityKarat}K</dd>
        </div>
        <div className="review-list__row">
          <dt>Selected Plan</dt>
          <dd>{selectedScheme?.name || '—'}</dd>
        </div>
      </dl>

      {error && (
        <p className="field-error field-error--block" role="alert">
          {error}
        </p>
      )}

      <div className="btn-row">
        <button type="button" className="btn btn-secondary" onClick={onBack} disabled={submitting}>
          Back
        </button>
        <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
          {submitting ? 'Submitting…' : 'Submit Application'}
        </button>
      </div>
    </div>
  );
}
