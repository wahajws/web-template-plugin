'use strict';

const express = require('express');
const trimRequest = require('trim-request');
const StripeController = require('../controllers/stripe-controller');

const router = express.Router();

router.get('/connection', StripeController.connection);
router.get('/dashboard', StripeController.dashboard);

router.get('/products', StripeController.products);
router.post('/products', trimRequest.all, StripeController.createProduct);

router.get('/prices', StripeController.prices);
router.post('/prices', trimRequest.all, StripeController.createPrice);

router.get('/payment-links', StripeController.paymentLinks);
router.post('/payment-links', trimRequest.all, StripeController.createPaymentLink);

router.get('/customers', StripeController.customers);
router.get('/subscriptions', StripeController.subscriptions);
router.get('/invoices', StripeController.invoices);
router.get('/payments', StripeController.payments);
router.post('/webhook', StripeController.webhook);

module.exports = router;
