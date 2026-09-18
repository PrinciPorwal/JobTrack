const express = require('express');
const router = express.Router();
const {
  getDashboardSummary,
  getMonthlyAnalytics,
} = require('../controllers/analytics.controller');

router.get('/dashboard', getDashboardSummary);
router.get('/monthly', getMonthlyAnalytics);

module.exports = router;
