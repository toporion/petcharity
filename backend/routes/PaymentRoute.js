const { createPaymentIntent } = require('../controllers/paymentController');

const router = require('express').Router()

router.post("/create-payment-intent", createPaymentIntent);

module.exports = router;