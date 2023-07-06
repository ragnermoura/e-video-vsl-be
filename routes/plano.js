const express = require('express');
const PlanController = require('../controllers/payment/plans/planController');
const router = express.Router();

router.post('/create', PlanController.createNewPlan)

module.exports = router