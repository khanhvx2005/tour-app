const router = require('express').Router();

const controller = require("../../controllers/client/order.controller");

router.post('/create', controller.createPost)
router.get('/success', controller.success)
router.get('/payment-zalopay', controller.paymentZalopay)
router.post('/payment-zalopay-result', controller.paymentZalopayResultPost)

module.exports = router;