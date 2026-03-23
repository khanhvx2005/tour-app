const router = require('express').Router();

const tourController = require("../../controllers/admin/tour.controller");

router.get('/list', tourController.list)
router.get('/create', tourController.create)
router.get('/trash', tourController.trash)

// router.get('/create', categoryController.create)

// router.post('/revenue-chart', dashboardController.revenueChartPost)

module.exports = router;