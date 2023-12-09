const router = require('express').Router();
const paymentController = require('../controllers/payment.controller');

router.post('/create_payment_url', paymentController.createPaymentURL);
router.get('/vnpay_return', paymentController.vnpayReturn);
router.get('/vnpay_ipn', paymentController.vnpayIpn);

module.exports = router;
