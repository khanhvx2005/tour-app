const Tour = require('../../models/tour.model')
const moment = require('moment')
const City = require('../../models/city.model')
module.exports.cart = async (req, res) => {
  res.render("client/pages/cart", {
    pageTitle: "Giỏ hàng"
  })
}
module.exports.detail = async (req, res) => {
  const cart = req.body;
  const finalCart = []; // Tạo mảng mới để chứa các tour hợp lệ
  for (const item of cart) {
    const tour = await Tour.findOne({
      _id: item.tourId,
      deleted: false,
      status: "active"
    })
    if (tour) {
      item.avatar = tour.avatar;
      item.name = tour.name;
      item.slug = tour.slug;
      item.departureDateFormat = moment(tour.departureDate).format("DD/MM/YYYY");
      item.priceNewAdult = tour.priceNewAdult;
      item.priceNewChildren = tour.priceNewChildren;
      item.priceNewBaby = tour.priceNewBaby;
      const city = await City.findOne({
        _id: item.locationFrom
      })
      item.locationFromName = city.name;
      finalCart.push(item)
    }

  }
  res.json({
    code: "success",
    cart: finalCart
  })
}