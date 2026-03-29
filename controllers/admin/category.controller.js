const categoryHelper = require("../../helpers/category.helper")
const Category = require("../../models/category.model")

module.exports.list = async (req, res) => {
    res.render("admin/pages/category-list", {
        pageTitle: "Trang danh sách danh mục"
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
    res.json({
        code: "success",
        message: "Tạo danh mục thành công!"
    })
}