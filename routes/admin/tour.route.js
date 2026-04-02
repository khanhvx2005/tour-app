const router = require('express').Router();

const tourController = require("../../controllers/admin/tour.controller");
const multer = require('multer');

const cloudinaryHelper = require('../../helpers/uploadCloudinary.helper')
const upload = multer({ storage: cloudinaryHelper.storage });

router.get('/list', tourController.list)
router.get('/create', tourController.create)
router.get('/trash', tourController.trash)
router.post('/create', upload.single('avatar'), tourController.createPost)
// router.get('/create', categoryController.create)

// router.post('/revenue-chart', dashboardController.revenueChartPost)

module.exports = router;