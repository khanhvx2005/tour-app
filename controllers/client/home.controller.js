const Tour = require("../../models/tour.model")
const moment = require('moment')
module.exports.home = async (req, res) => {
    // Section 2
    const tourListSection2 = await Tour
        .find({
            deleted: false,
            status: "active"
        })
        .limit(3)
        .sort({
            position: 'desc'
        })
    for (const item of tourListSection2) {
        item.discount = (((item.priceAdult - item.priceNewAdult) / item.priceAdult) * 100).toFixed();
        item.departureDateFormat = moment(item.departureDate).format('DD/MM/YYYY');
    }
    // End Section 2
    res.render('client/pages/home.pug', { titlePage: "Trang chủ", tourListSection2: tourListSection2 })
}