const Tour = require("../../models/tour.model")
const moment = require('moment')
const categoryHelper = require('../../helpers/category.helper')
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

    // Section 4 : Lấy danh sách tour thuộc danh mục Tour trong nước
    const idCategorySection4 = "69c8a2fb28816fa2f34eeb42";
    const listCategorySection4 = await categoryHelper.getCategory(idCategorySection4)
    const listCategoryIdSection4 = listCategorySection4.map((item) => {
        return item.id
    })
    listCategoryIdSection4.push(idCategorySection4)
    const tourListSection4 = await Tour
        .find({
            category: { $in: listCategoryIdSection4 },
            deleted: false,
            status: "active"
        })
        .limit(6)
        .sort({
            position: 'desc'
        })
    for (const item of tourListSection4) {
        item.discount = (((item.priceAdult - item.priceNewAdult) / item.priceAdult) * 100).toFixed();
        item.departureDateFormat = moment(item.departureDate).format('DD/MM/YYYY');
    }
    // End section 4

    // Section 6 : Lấy danh sách tour thuộc danh mục Tour nước ngoài
    const idCategorySection6 = "69c8f1e499a07cc6b2202049";
    const listCategorySection6 = await categoryHelper.getCategory(idCategorySection6)
    const listCategoryIdSection6 = listCategorySection6.map((item) => {
        return item.id
    })
    listCategoryIdSection6.push(idCategorySection6)
    const tourListSection6 = await Tour
        .find({
            category: { $in: listCategoryIdSection6 },
            deleted: false,
            status: "active"
        })
        .limit(6)
        .sort({
            position: 'desc'
        })
    for (const item of tourListSection6) {
        item.discount = (((item.priceAdult - item.priceNewAdult) / item.priceAdult) * 100).toFixed();
        item.departureDateFormat = moment(item.departureDate).format('DD/MM/YYYY');
    }
    // End section 6

    res.render('client/pages/home.pug', {
        titlePage: "Trang chủ",
        tourListSection2: tourListSection2,
        tourListSection4: tourListSection4,
        tourListSection6: tourListSection6
    })
}