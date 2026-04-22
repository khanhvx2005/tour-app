const router = require('express').Router();

const controller = require("../../controllers/client/order.controller");

router.post('/create', controller.createPost)

module.exports = router;