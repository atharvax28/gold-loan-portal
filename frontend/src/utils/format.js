export function formatInr(amount) {
  if (amount === null || amount === undefined || Number.isNaN(amount)) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatGrams(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return `${value} g`;
}

/**
 * Masks a 10-digit mobile number as 9876XXXX10 (first 4 and last 2 digits
 * visible, middle 4 masked) for the admin/partner summary view.
 */
export function maskMobile(mobileNumber) {
  if (!mobileNumber || mobileNumber.length !== 10) return mobileNumber || '—';
  return `${mobileNumber.slice(0, 4)}XXXX${mobileNumber.slice(8)}`;
}

export function formatDate(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}
