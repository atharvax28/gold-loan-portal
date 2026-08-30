const { getLoanSchemes } = require('../services/loanSchemes.data');

function listLoanSchemes(req, res) {
  res.status(200).json({ schemes: getLoanSchemes() });
}

module.exports = { listLoanSchemes };
