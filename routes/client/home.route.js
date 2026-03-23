const router = require('express').Router();

const controller = require("../../controllers/client/home.controller");

router.get('/', controller.home)

module.exports = router;