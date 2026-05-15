const router = require('express').Router();

const couponController = require("../../controllers/client/coupon.controller");

router.post('/detail', couponController.detail)


module.exports = router;