const router = require('express').Router();

const couponController = require("../../controllers/admin/coupon.controller");

router.get('/list', couponController.list)
router.get('/create', couponController.create)
router.post('/create', couponController.createPost)
router.get('/edit/:id', couponController.edit)
module.exports = router;


