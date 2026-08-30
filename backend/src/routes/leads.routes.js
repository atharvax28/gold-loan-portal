const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { submitLead, listLeads } = require('../controllers/leads.controller');

const router = express.Router();

router.post('/submit', asyncHandler(submitLead));
router.get('/', asyncHandler(listLeads));

module.exports = router;
