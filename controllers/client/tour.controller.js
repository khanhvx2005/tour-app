const Tour = require("../../models/tour.model");

module.exports.detail = (req, res) => {
    res.render("client/pages/tour-detail.pug", { titlePage: "Chi tiết tour" })
}