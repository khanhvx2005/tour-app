const categoryHelper = require("../../helpers/category.helper")
const AccountAdmin = require("../../models/account-admin.model")
const Category = require("../../models/category.model")
const moment = require('moment');

module.exports.list = async (req, res) => {
    const categoryList = await Category.find({
        deleted: false
    }).sort({ position: "desc" })
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
            item.createdAtFormat = moment(item.createdAt).format('HH:mm - DD/MM/YYYY')
            item.updatedAtFormat = moment(item.updatedAt).format('HH:mm - DD/MM/YYYY')

        }

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