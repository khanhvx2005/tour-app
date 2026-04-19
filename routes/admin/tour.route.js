const router = require('express').Router();
const tourController = require("../../controllers/admin/tour.controller");
const multer = require('multer');
const cloudinaryHelper = require('../../helpers/uploadCloudinary.helper')
const upload = multer({ storage: cloudinaryHelper.storage });
const tourValidate = require('../../validates/admin/tour.validate')

router.get('/list', tourController.list)
router.get('/create', tourController.create)
router.get('/trash', tourController.trash)
router.post('/create', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'images', maxCount: 4 }]), tourValidate.createPost, tourController.createPost)
router.patch('/change-multi', tourController.changeMultiPatch)
router.get('/edit/:id', tourController.edit)
router.patch(
    '/edit/:id',
    upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'images', maxCount: 4 }]),
    tourValidate.createPost,
    tourController.editPatch
)
router.patch('/delete/:id', tourController.deletePatch)
router.patch('/undo/:id', tourController.undoPatch)
router.patch('/delete-destroy/:id', tourController.deleteDestroyPatch)
router.patch('/trash/change-multi', tourController.trashChangeMultiPatch)
// router.post('/revenue-chart', dashboardController.revenueChartPost)

module.exports = router;