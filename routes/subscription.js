const express = require('express');
const SubscriptionController = require('../controllers/payment/subscription/subscriptionController');
const router = express.Router();

router.post('/create',SubscriptionController.CreateSubscription)

module.exports = router