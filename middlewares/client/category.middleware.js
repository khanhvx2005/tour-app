const Category = require("../../models/category.model")
const categoryHelper = require('../../helpers/category.helper')
module.exports.category = async (req, res, next) => {
    const categoryList = await Category.find({
        deleted: false,
        status: "active"
    })
    const newCategoryList = categoryHelper.buildCategoryTree(categoryList)
    res.locals.listCategory = newCategoryList;
    next()
}