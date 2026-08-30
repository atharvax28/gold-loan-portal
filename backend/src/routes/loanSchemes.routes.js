const express = require('express');
const { listLoanSchemes } = require('../controllers/loanSchemes.controller');

const router = express.Router();

router.get('/', listLoanSchemes);

module.exports = router;
