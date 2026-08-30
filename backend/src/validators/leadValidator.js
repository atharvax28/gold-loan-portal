const { getSchemeById } = require('../services/loanSchemes.data');

const VALID_KARATS = [18, 22, 24];

// Indian mobile numbers: 10 digits, first digit 6-9.
const MOBILE_REGEX = /^[6-9]\d{9}$/;

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

/**
 * Validates the /leads/submit payload.
 * Returns { valid: boolean, errors: Array<{ field: string, message: string }> }
 */
function validateLeadSubmission(payload = {}) {
  const errors = [];
  const {
    customerName,
    mobileNumber,
    grossWeightGrams,
    netWeightGrams,
    purityKarat,
    selectedPlanId,
  } = payload;

  if (!isNonEmptyString(customerName)) {
    errors.push({ field: 'customerName', message: 'customerName is required.' });
  } else if (customerName.trim().length < 2 || customerName.trim().length > 100) {
    errors.push({ field: 'customerName', message: 'customerName must be between 2 and 100 characters.' });
  }

  if (!isNonEmptyString(mobileNumber) || !MOBILE_REGEX.test(mobileNumber.trim())) {
    errors.push({
      field: 'mobileNumber',
      message: 'mobileNumber must be a valid 10-digit Indian mobile number (starting 6-9).',
    });
  }

  if (!isFiniteNumber(grossWeightGrams) || grossWeightGrams <= 0) {
    errors.push({ field: 'grossWeightGrams', message: 'grossWeightGrams must be a positive number.' });
  }

  if (!isFiniteNumber(netWeightGrams) || netWeightGrams <= 0) {
    errors.push({ field: 'netWeightGrams', message: 'netWeightGrams must be a positive number.' });
  }

  // Only compare weights once both are individually valid numbers.
  if (
    isFiniteNumber(grossWeightGrams) &&
    isFiniteNumber(netWeightGrams) &&
    grossWeightGrams > 0 &&
    netWeightGrams > 0 &&
    netWeightGrams > grossWeightGrams
  ) {
    // Spec: net must be <= gross, so only strictly-greater is an error
    // (net === gross, e.g. an uncoated bar with no stone/mount loss, is valid).
    errors.push({
      field: 'netWeightGrams',
      message: 'netWeightGrams must be less than or equal to grossWeightGrams.',
    });
  }

  if (!VALID_KARATS.includes(purityKarat)) {
    errors.push({
      field: 'purityKarat',
      message: `purityKarat must be one of: ${VALID_KARATS.join(', ')}.`,
    });
  }

  if (!isNonEmptyString(selectedPlanId) || !getSchemeById(selectedPlanId)) {
    errors.push({ field: 'selectedPlanId', message: 'selectedPlanId does not match any available loan scheme.' });
  }

  return { valid: errors.length === 0, errors };
}

module.exports = {
  validateLeadSubmission,
  MOBILE_REGEX,
  VALID_KARATS,
};
