const router = require('express').Router();

const controller = require("../../controllers/client/order.controller");

router.post('/create', controller.createPost)
router.get('/success', controller.success)
module.exports = router;