const router = require('express').Router();
const settingController = require("../../controllers/admin/setting.controller");
const multer = require('multer');
const uploadCloudinaryHelper = require('../../helpers/uploadCloudinary.helper')
const upload = multer({ storage: uploadCloudinaryHelper.storage });

router.get('/list', settingController.list)
router.get('/website-info', settingController.websiteInfo)
router.patch('/website-info',
    upload.fields(
        [
            { name: 'logo', maxCount: 1 },
            { name: 'favicon', maxCount: 1 }
        ]
    ),
    settingController.websiteInfoPatch
)
router.get('/account-admin/list', settingController.accountAdminList)

router.get('/account-admin/create', settingController.accountAdminCreate)
router.get('/role/list', settingController.roleList)
router.get('/role/create', settingController.roleCreate)
router.post('/role/create', settingController.roleCreatePost)
router.patch('/role/change-multi', settingController.roleChangeMultiPatch)
router.patch('/role/delete/:id', settingController.roleDeletePatch)
router.get('/role/edit/:id', settingController.roleEdit)
router.patch('/role/edit/:id', settingController.roleEditPatch)

module.exports = router;