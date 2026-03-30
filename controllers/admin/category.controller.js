const categoryHelper = require("../../helpers/category.helper")
const AccountAdmin = require("../../models/account-admin.model")
const Category = require("../../models/category.model")
const moment = require('moment');

module.exports.list = async (req, res) => {
    const find = {
        deleted: false
    }
    if (req.query.status) {
        find.status = req.query.status;
    }
    const categoryList = await Category.find(find).sort({ position: "desc" })
    for (const item of categoryList) {
        if (item.createdBy) {
            const infoAccount = await AccountAdmin.findOne({
                _id: item.createdBy,

            })
            item.createdByFullName = infoAccount.fullName;

        }
        if (item.updatedBy) {
            const infoAccount = await AccountAdmin.findOne({
                _id: item.updatedBy,

            })
            item.updatedByFullName = infoAccount.fullName;
        }
        item.createdAtFormat = moment(item.createdAt).format('HH:mm - DD/MM/YYYY')
        item.updatedAtFormat = moment(item.updatedAt).format('HH:mm - DD/MM/YYYY')

    }
    res.render("admin/pages/category-list", {
        pageTitle: "Trang danh sách danh mục",
        categoryList: categoryList
    })
}
module.exports.create = async (req, res) => {
    const categoryList = await Category.find({
        deleted: false
    })

    const newCategoryList = categoryHelper.buildCategoryTree(categoryList)
    // console.log(newCategoryList);

    res.render("admin/pages/category-create", {
        pageTitle: "Trang tạo danh mục",
        categoryList: newCategoryList
    })
}
module.exports.createPost = async (req, res) => {
    if (!req.body.position) {
        const count = await Category.countDocuments();
        req.body.position = count + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }
    req.body.avatar = req.file ? req.file.path : "";
    const newCategory = new Category({
        name: req.body.name,
        parent: req.body.parent,
        position: req.body.position,
        status: req.body.status,
        avatar: req.body.avatar,
        description: req.body.description,
        createdBy: req.account.id,
        updatedBy: req.account.id
    })
    await newCategory.save();
    req.flash("success", "Tạo danh mục thành công!")
    res.json({
        code: "success",

    })
}
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const categoryDetail = await Category.findOne({
            _id: id,
            deleted: false
        })
        // Lấy danh sách các danh mục hiển thị trường danh mục cha bên giao diện
        const categoryList = await Category.find({
            deleted: false
        })
        const newCategoryList = categoryHelper.buildCategoryTree(categoryList);
        res.render('admin/pages/category-edit', { pageTitle: "Trang chỉnh sửa danh mục", categoryDetail: categoryDetail, categoryList: newCategoryList })
    }
    catch (error) {
        res.redirect(`/${pathAdmin}/category/list`)
    }

}

module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;
        if (!req.body.position) {
            const count = await Category.countDocuments();
            req.body.position = count + 1;
        } else {
            req.body.position = parseInt(req.body.position);
        }
        const objCategory = {
            name: req.body.name,
            parent: req.body.parent,
            position: req.body.position,
            status: req.body.status,
            description: req.body.description,
            updatedBy: req.account.id
        }

        if (req.file) {
            objCategory.avatar = req.file.path;
        }
        await Category.updateOne({
            _id: id,
            deleted: false
        }, objCategory)
        req.flash("success", "Cập nhập danh mục thành công!")
        res.json({
            code: "success",
            message: "Cập nhập danh mục thành công!"
        })
    } catch (error) {
        res.json({
            code: "error",
            message: "Id không hợp lệ"
        })
    }

}
module.exports.deletePatch = async (req, res) => {
    try {
        const id = req.params.id;
        await Category.updateOne({
            _id: id,

        }, {
            deleted: true,
            deletedBy: req.account.id,
            deletedAt: Date.now()
        })
        req.flash("success", "Xóa danh mục thành công!")

        res.json({
            code: "success",

        })
    } catch (error) {
        res.json({
            code: "error",
            message: "Id không hợp lệ!"
        })
    }
}