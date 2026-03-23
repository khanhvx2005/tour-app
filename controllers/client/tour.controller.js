const Tour = require("../../models/tour.model");
module.exports.list = async (req, res) => {
    const tourList = await Tour.find();
    res.render("client/pages/tour-list.pug", { titlePage: "Trang danh sách tour", tourList: tourList })
}
module.exports.detail = (req, res) => {
    res.render("client/pages/tour-detail.pug", { titlePage: "Chi tiết tour" })
}