const express = require('express')
const router = express.Router()
const controller = require("../../controllers/client/tour.controller");
router.get('/detail/:slug', controller.detail)
module.exports = router
