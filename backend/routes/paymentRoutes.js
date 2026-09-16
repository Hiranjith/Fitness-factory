const express = require('express');
const router = express.Router();
const { getRecentPayments, getAllPayments, getUpcomingPayments } = require('../controllers/paymentController');

router.get('/', getAllPayments);
router.get('/recent', getRecentPayments);
router.get('/upcoming', getUpcomingPayments);

module.exports = router;
