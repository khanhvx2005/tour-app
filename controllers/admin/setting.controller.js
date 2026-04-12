const Role = require("../../models/role.model")
const WebsiteInfo = require("../../models/setting-website-info.model")
const permissionConfig = require('../../config/permission')
const slugify = require("slugify")
const AccountAdmin = require("../../models/account-admin.model")
const bcrypt = require("bcryptjs")
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
    const accountAdminList = await AccountAdmin.find({
        deleted: false
    })
    for (const item of accountAdminList) {
        if (item.role) {
            const infoRole = await Role.findOne({
                _id: item.role
            })
            if (infoRole) {
                item.roleName = infoRole.name;

            }
        }

    }
    res.render("admin/pages/setting-account-admin-list", {
        pageTitle: "Tài khoản quản trị",
        accountAdminList: accountAdminList
    })
}
module.exports.accountAdminCreate = async (req, res) => {
    const roleList = await Role.find({
        deleted: false
    })
    res.render("admin/pages/setting-account-admin-create", {
        pageTitle: "Tạo tài khoản quản trị",
        roleList: roleList
    })
}
module.exports.accountAdminCreatePost = async (req, res) => {
    const exitsAccount = await AccountAdmin.findOne({
        email: req.body.email
    })
    if (exitsAccount) {
        res.json({
            code: "error",
            message: "Email đã tồn tại trong hệ thống!"
        })
        return;
    } else {
        req.body.avatar = req.file ? req.file.path : "";
        req.body.createdBy = req.account.id;
        req.body.updatedBy = req.account.id;
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);
        req.body.password = hashedPassword;
        const newAccountAdmin = new AccountAdmin(req.body)
        await newAccountAdmin.save()
        req.flash("success", "Tạo tài khoản thành công!")
        res.json({
            code: "success"
        })
    }


}
module.exports.roleList = async (req, res) => {
    const find = {
        deleted: false
    }
    if (req.query.keyword) {
        const slug = slugify(req.query.keyword, {
            lower: true,
            strict: true,
            trim: true
        })
        const slugRegex = new RegExp(slug, "i");
        find.slug = slugRegex;
    }
    const roleList = await Role.find(find)

    res.render("admin/pages/setting-role-list", {
        pageTitle: "Nhóm quyền",
        roleList: roleList
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
module.exports.roleChangeMultiPatch = async (req, res) => {
    try {
        const { ids, status } = req.body;
        switch (status) {
            case 'delete':
                await Role.updateMany({
                    _id: { $in: ids }
                }, {
                    deleted: true,
                    deletedBy: req.account.id,
                    deletedAt: Date.now()
                })
                req.flash("success", "Xóa nhóm quyền thành công")
                break;

            default:
                break;
        }
        res.json({
            code: "success"
        })
    } catch (error) {
        console.log("Có lỗi controller roleChangeMultiPatch  ", error)
    }
}
module.exports.roleDeletePatch = async (req, res) => {
    try {
        const id = req.params.id;
        await Role.updateOne({
            _id: id
        }, {
            deleted: true,
            deletedBy: req.account.id,
            deletedAt: Date.now()

        })
        req.flash("success", "Xóa nhóm quyền thành công")
        res.json({
            code: "success",
        })
    } catch (error) {
        res.json({
            code: "error",
            message: "id không hợp lệ"
        })
    }
}
module.exports.roleEdit = async (req, res) => {
    try {
        const id = req.params.id;
        const roleDetail = await Role.findOne({
            _id: id,
        })
        if (roleDetail) {
            res.render('admin/pages/setting-role-edit', {
                pageTitle: "Trang chỉnh sửa nhóm quyền",
                roleDetail: roleDetail,
                permissionList: permissionConfig.permissionList
            })
        } else {
            res.redirect(`/${pathAdmin}/setting/role/list`)

        }

    } catch (error) {
        res.redirect(`/${pathAdmin}/setting/role/list`)
    }
}
module.exports.roleEditPatch = async (req, res) => {
    try {
        const id = req.params.id;
        req.body.updatedBy = req.account.id;

        await Role.updateOne({
            _id: id
        }, req.body)
        req.flash("success", "Cập nhập nhóm quyền thành công")
        res.json({
            code: "success"

        })
    } catch (error) {
        res.json({
            code: "error",
            message: "id không hợp lệ"

        })
    }
}

