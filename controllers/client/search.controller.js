const slugify = require("slugify")
const Tour = require("../../models/tour.model")
const moment = require("moment")
const searchHelper = require('../../helpers/search.helper')
module.exports.search = async (req, res) => {
    try {
        // Tối ưu bộ lọc
        const findQuery = searchHelper.buildSearchQuery(req.query)
        // End tối ưu bộ lọc
        const tourList = await Tour.find(findQuery)
        for (const item of tourList) {
            item.discount = (((item.priceAdult - item.priceNewAdult) / item.priceAdult) * 100).toFixed();
            item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY")
        }
        res.render('client/pages/search', {
            pageTitle: "Trang tìm kiếm",
            tourList: tourList

        })
    } catch (error) {
        console.log("Có lỗi tại tính năng tìm kiếm tour", error)
        res.redirect('back')
    }
}