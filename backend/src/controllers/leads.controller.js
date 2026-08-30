const { v4: uuidv4 } = require('uuid');
const config = require('../config');
const { ApiError } = require('../middleware/errorHandler');
const { validateLeadSubmission } = require('../validators/leadValidator');
const { getSchemeById } = require('../services/loanSchemes.data');
const { buildCollateralSummary, computeMaxLoanAmountInr } = require('../services/calculation.service');
const store = require('../db/jsonStore');

const DEDUPE_WINDOW_MS = config.dedupeWindowDays * 24 * 60 * 60 * 1000;

function submitLead(req, res) {
  const { valid, errors } = validateLeadSubmission(req.body);
  if (!valid) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'One or more fields are invalid.', errors);
  }

  const { customerName, mobileNumber, grossWeightGrams, netWeightGrams, purityKarat, selectedPlanId } = req.body;
  const normalizedMobile = mobileNumber.trim();

  // Deduplication: reject if the same mobile number submitted within the window.
  const now = Date.now();
  const priorSubmissions = store.findLeadsByMobile(normalizedMobile);
  const recentDuplicate = priorSubmissions.find((lead) => now - new Date(lead.createdAt).getTime() < DEDUPE_WINDOW_MS);
  if (recentDuplicate) {
    throw new ApiError(
      409,
      'DUPLICATE_SUBMISSION',
      `A lead for this mobile number was already submitted on ${recentDuplicate.createdAt}. Please wait ${config.dedupeWindowDays} days before resubmitting.`,
    );
  }

  const scheme = getSchemeById(selectedPlanId);

  const collateral = buildCollateralSummary({
    netWeightGrams,
    purityKarat,
    goldRatePerGram24kInr: config.goldRatePerGram24kInr,
  });
  const maxLoanAmountForSelectedPlanInr = computeMaxLoanAmountInr(collateral.goldMarketValueInr, scheme.maxLtvPercent);

  const lead = {
    applicationId: uuidv4(),
    customerName: customerName.trim(),
    mobileNumber: normalizedMobile,
    grossWeightGrams,
    netWeightGrams,
    purityKarat,
    pureGoldWeightGrams: collateral.pureGoldWeightGrams,
    goldRatePerGram24kInr: collateral.goldRatePerGram24kInr,
    goldMarketValueInr: collateral.goldMarketValueInr,
    maxEligibleLoanAmountInr: collateral.maxEligibleLoanAmountInr,
    selectedPlanId: scheme.planId,
    selectedPlanName: scheme.name,
    selectedPlanInterestRatePercent: scheme.baseInterestRatePercent,
    selectedPlanMaxLtvPercent: scheme.maxLtvPercent,
    calculatedLoanAmountInr: maxLoanAmountForSelectedPlanInr,
    status: 'SUBMITTED',
    createdAt: new Date().toISOString(),
  };

  store.insertLead(lead);

  res.status(201).json({ message: 'Application submitted successfully.', lead });
}

function listLeads(req, res) {
  const leads = store.readAll().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.status(200).json({ count: leads.length, leads });
}

module.exports = { submitLead, listLeads };
