const AccountAdmin = require("../../models/account-admin.model")
const bcrypt = require("bcryptjs")

module.exports.edit = async (req, res) => {
    res.render("admin/pages/profile-edit", {
        pageTitle: "Thông tin cá nhân"
    })
}
module.exports.editPatch = async (req, res) => {
    try {
        const exitsAccount = await AccountAdmin.findOne({
            email: req.body.email,
            _id: { $ne: req.account.id }
        })
        if (exitsAccount) {
            res.json({
                code: "error",
                message: "Email đã tồn tại trong hệ thống"
            })
            return;
        }
        if (req.file) {
            req.body.avatar = req.file.path;
        } else {
            delete req.body.avatar;
        }
        req.body.updatedBy = req.account.id;
        await AccountAdmin.updateOne({
            _id: req.account.id
        }, req.body)
        req.flash("success", "Cập nhập thành công")
        res.json({
            code: "success",
            message: "Cập nhập thành công"
        })
    } catch (error) {
        res.json({
            code: "error",
            message: error
        })
    }
}
module.exports.changePassword = async (req, res) => {
    res.render("admin/pages/profile-change-password", {
        pageTitle: "Đổi mật khẩu"
    })
}
module.exports.changePasswordPatch = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
        req.body.updatedBy = req.account.id;
        await AccountAdmin.updateOne({
            _id: req.account.id
        }, req.body)
        req.flash("success", "Đổi mật khẩu thành công")
        res.json({
            code: "success",
        })
    } catch (error) {
        res.json({
            code: "error",
            message: error
        })
    }
}