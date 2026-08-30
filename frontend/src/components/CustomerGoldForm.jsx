import { useMemo } from 'react';

const MOBILE_REGEX = /^[6-9]\d{9}$/;
const KARAT_OPTIONS = [18, 22, 24];

export function validateStep1(form) {
  const errors = {};

  if (!form.customerName.trim()) {
    errors.customerName = 'Customer name is required.';
  } else if (form.customerName.trim().length < 2) {
    errors.customerName = 'Customer name is too short.';
  }

  if (!MOBILE_REGEX.test(form.mobileNumber.trim())) {
    errors.mobileNumber = 'Enter a valid 10-digit mobile number (starting 6-9).';
  }

  const gross = Number(form.grossWeightGrams);
  const net = Number(form.netWeightGrams);

  if (!form.grossWeightGrams || !(gross > 0)) {
    errors.grossWeightGrams = 'Gross weight must be a positive number.';
  }

  if (!form.netWeightGrams || !(net > 0)) {
    errors.netWeightGrams = 'Net weight must be a positive number.';
  } else if (gross > 0 && net > gross) {
    errors.netWeightGrams = 'Net weight cannot exceed gross weight.';
  }

  if (!KARAT_OPTIONS.includes(Number(form.purityKarat))) {
    errors.purityKarat = 'Select a purity.';
  }

  return errors;
}

export default function CustomerGoldForm({ form, onChange, onNext }) {
  const errors = useMemo(() => validateStep1(form), [form]);
  const hasErrors = Object.keys(errors).length > 0;
  const isDirty = form.customerName || form.mobileNumber || form.grossWeightGrams || form.netWeightGrams;

  function handleField(field, value) {
    onChange({ ...form, [field]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!hasErrors) onNext();
  }

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <h2>Customer &amp; Gold Details</h2>

      <div className="field">
        <label htmlFor="customerName">Customer Name</label>
        <input
          id="customerName"
          type="text"
          placeholder="e.g. Rahul Sharma"
          value={form.customerName}
          onChange={(e) => handleField('customerName', e.target.value)}
        />
        {isDirty && errors.customerName && <span className="field-error" role="alert">{errors.customerName}</span>}
      </div>

      <div className="field">
        <label htmlFor="mobileNumber">Mobile Number</label>
        <input
          id="mobileNumber"
          type="tel"
          inputMode="numeric"
          maxLength={10}
          placeholder="9876543210"
          value={form.mobileNumber}
          onChange={(e) => handleField('mobileNumber', e.target.value.replace(/\D/g, ''))}
        />
        {isDirty && errors.mobileNumber && <span className="field-error" role="alert">{errors.mobileNumber}</span>}
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="grossWeightGrams">Gross Weight (g)</label>
          <input
            id="grossWeightGrams"
            type="number"
            min="0"
            step="0.01"
            placeholder="50"
            value={form.grossWeightGrams}
            onChange={(e) => handleField('grossWeightGrams', e.target.value)}
          />
          {isDirty && errors.grossWeightGrams && <span className="field-error" role="alert">{errors.grossWeightGrams}</span>}
        </div>

        <div className="field">
          <label htmlFor="netWeightGrams">Net Weight (g)</label>
          <input
            id="netWeightGrams"
            type="number"
            min="0"
            step="0.01"
            placeholder="45"
            value={form.netWeightGrams}
            onChange={(e) => handleField('netWeightGrams', e.target.value)}
          />
          {isDirty && errors.netWeightGrams && <span className="field-error" role="alert">{errors.netWeightGrams}</span>}
        </div>
      </div>

      <div className="field">
        <label htmlFor="purityKarat">Purity</label>
        <select
          id="purityKarat"
          value={form.purityKarat}
          onChange={(e) => handleField('purityKarat', Number(e.target.value))}
        >
          {KARAT_OPTIONS.map((k) => (
            <option key={k} value={k}>
              {k}K
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn btn-primary" disabled={hasErrors}>
        Next: Calculate Loan
      </button>
    </form>
  );
}
