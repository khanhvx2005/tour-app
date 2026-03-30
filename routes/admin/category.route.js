const router = require('express').Router();
const categoryController = require("../../controllers/admin/category.controller");
const cloudinaryHelper = require('../../helpers/uploadCloudinary.helper')
const multer = require('multer')
const upload = multer({ storage: cloudinaryHelper.storage })
const categoryValidate = require('../../validates/admin/category.validate')
router.get('/list', categoryController.list)
router.get('/create', categoryController.create)
router.post('/create', upload.single('avatar'), categoryValidate.createPost, categoryController.createPost)
router.get('/edit/:id', categoryController.edit)
router.patch('/edit/:id', upload.single('avatar'), categoryValidate.editPatch, categoryController.editPatch)
router.patch('/delete/:id', categoryController.delete)
// router.post('/revenue-chart', dashboardController.revenueChartPost)

module.exports = router;