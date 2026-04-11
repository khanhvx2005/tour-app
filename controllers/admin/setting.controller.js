const Role = require("../../models/role.model")
const WebsiteInfo = require("../../models/setting-website-info.model")
const permissionConfig = require('../../config/permission')
module.exports.list = async (req, res) => {

    res.render("admin/pages/setting-list", {
        pageTitle: "Cài đặt chung",
    })
}
module.exports.websiteInfo = async (req, res) => {
    const infoWebsite = await WebsiteInfo.findOne({})
    res.render("admin/pages/setting-website-info", {
        pageTitle: "Thông tin website",
        infoWebsite: infoWebsite
    })
}
module.exports.websiteInfoPatch = async (req, res) => {

    if (req.files && req.files.logo) {
        req.body.logo = req.files.logo[0].path;
    } else {
        delete req.body.logo;
    }
    if (req.files && req.files.favicon) {
        req.body.favicon = req.files.favicon[0].path;
    } else {
        delete req.body.favicon;
    }
    req.body.updatedBy = req.account.id;
    const infoWebsite = await WebsiteInfo.findOne({})
    if (infoWebsite) {
        await WebsiteInfo.updateOne({
            _id: infoWebsite.id
        }, req.body)
    } else {
        const newRecord = new WebsiteInfo(req.body)
        await newRecord.save();
    }


    res.json({
        code: "success",
        message: "Cập nhập thành công"
    })
}
module.exports.accountAdminList = async (req, res) => {

    res.render("admin/pages/setting-account-admin-list", {
        pageTitle: "Tài khoản quản trị",
    })
}
module.exports.accountAdminCreate = async (req, res) => {
    res.render("admin/pages/setting-account-admin-create", {
        pageTitle: "Tạo tài khoản quản trị",
    })
}
module.exports.roleList = async (req, res) => {


    res.render("admin/pages/setting-role-list", {
        pageTitle: "Nhóm quyền",
    })
}
module.exports.roleCreate = async (req, res) => {

    res.render("admin/pages/setting-role-create", {
        pageTitle: "Tạo nhóm quyền",
        permissionsList: permissionConfig.permissionList
    })
}
module.exports.roleCreatePost = async (req, res) => {
    req.body.createdBy = req.account.id;
    req.body.updatedBy = req.account.id;

    const newRole = new Role(req.body)
    await newRole.save()
    req.flash("success", "Tạo nhóm quyền thành công!")
    res.json({
        code: "success",
    })

}
