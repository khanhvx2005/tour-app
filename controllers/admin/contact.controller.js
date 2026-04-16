const Contact = require('../../models/contact.model')
const moment = require('moment')
const slugify = require('slugify')
module.exports.list = async (req, res) => {
    const find = {
        deleted: false
    }
    if (req.query.keyword) {
        const keywordReg = new RegExp(req.query.keyword, "i")
        find.email = keywordReg;
    }
    const contactList = await Contact.find(find)
    for (const item of contactList) {
        item.createdAtFormat = moment(item.createdAt).format("DD/MM/YYYY")
    }
    res.render("admin/pages/contact-list", {
        pageTitle: "Thông tin liên hệ",
        contactList: contactList
    })
}
module.exports.deletePatch = async (req, res) => {
    if (!req.permissions.includes("contact_delete")) {
        res.json({
            code: "error",
            message: "Bạn không có quyền truy cập hệ thống"
        })
        return;
    }
    try {
        const id = req.params.id;
        await Contact.updateOne({
            _id: id
        }, {
            deleted: true,
            deletedBy: req.account.id,
            deletedAt: Date.now()
        })
        req.flash("success", "Xóa thành công!")
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
module.exports.changeMultiPatch = async (req, res) => {
    try {
        const { ids, status } = req.body;
        switch (status) {
            case 'delete':
                if (!req.permissions.includes("contact_view")) {
                    res.json({
                        code: "error",
                        message: "Bạn không có quyền truy cập hệ thống"
                    })
                    return;
                }
                await Contact.updateMany({
                    _id: { $in: ids }
                }, {
                    deleted: true,
                    deletedBy: req.account.id,
                    deletedAt: Date.now()
                })
                break;

            default:
                break;
        }
        res.json({
            code: "success",
        })
    } catch (error) {
        console.log("Có lỗi controller changeMultiPatch", error)
        res.json({
            code: "error",
            message: error
        })
    }
}