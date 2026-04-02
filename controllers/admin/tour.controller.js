const Category = require("../../models/category.model")
const categoryHelper = require('../../helpers/category.helper')
const City = require("../../models/city.model")
const Tour = require('../../models/tour.model')
module.exports.list = async (req, res) => {
    res.render("admin/pages/tour-list", {
        pageTitle: "Trang danh sách tour"
    })
}
module.exports.create = async (req, res) => {
    try {
        const categoryList = await Category.find({
            deleted: false
        })
        const newCategoryList = categoryHelper.buildCategoryTree(categoryList);
        const cityList = await City.find({});
        res.render("admin/pages/tour-create", {
            pageTitle: "Tạo tour",
            categoryList: newCategoryList,
            cityList: cityList
        })
    } catch (error) {
        console.log("Có lỗi controller create", "error")
    }

}
module.exports.trash = async (req, res) => {


    res.render("admin/pages/tour-trash", {
        pageTitle: "Thùng rác tour",

    })
}
module.exports.createPost = async (req, res) => {
    if (!req.body.position) {
        const count = await Tour.countDocuments();
        req.body.position = count + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }
    req.body.priceAdult = req.body.priceAdult ? parseInt(req.body.priceAdult) : 0;
    req.body.priceChildren = req.body.priceChildren ? parseInt(req.body.priceChildren) : 0;
    req.body.priceBaby = req.body.priceBaby ? parseInt(req.body.priceBaby) : 0;
    req.body.priceNewAdult = req.body.priceNewAdult ? parseInt(req.body.priceNewAdult) : req.body.priceAdult;
    req.body.priceNewChildren = req.body.priceNewChildren ? parseInt(req.body.priceNewChildren) : req.body.priceChildren;
    req.body.priceNewBaby = req.body.priceNewBaby ? parseInt(req.body.priceNewBaby) : req.body.priceBaby;
    req.body.stockAdult = req.body.stockAdult ? parseInt(req.body.stockAdult) : 0;
    req.body.stockChildren = req.body.stockChildren ? parseInt(req.body.stockChildren) : 0;
    req.body.stockBaby = req.body.stockBaby ? parseInt(req.body.stockBaby) : 0;
    req.body.locations = req.body.locations ? JSON.parse(req.body.locations) : [];
    req.body.departureDate = req.body.departureDate ? new Date(req.body.departureDate) : null;
    req.body.schedules = req.body.schedules ? JSON.parse(req.body.schedules) : [];
    req.body.avatar = req.file ? req.file.path : "";
    req.body.createdBy = req.account.id;
    req.body.updatedBy = req.account.id;
    const newTour = new Tour(req.body);
    await newTour.save();
    req.flash("success", "Tạo tour thành công!")
    res.json({
        code: "success",
    })
}