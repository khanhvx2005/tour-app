const Order = require("../../models/order.model");
const Tour = require("../../models/tour.model")

module.exports.createPost = async (req, res) => {

  try {
    for (const item of req.body.items) {
      const infoTour = await Tour.findOne({
        _id: item.tourId,
        deleted: false,
        status: "active"
      })
      if (infoTour) {
        item.priceNewAdult = infoTour.priceNewAdult;
        item.priceNewChildren = infoTour.priceNewChildren;
        item.priceNewBaby = infoTour.priceNewBaby;
        item.departureDate = infoTour.departureDate;
        item.avatar = infoTour.avatar;
        item.name = infoTour.name;
        await Tour.updateOne({
          _id: item.tourId
        }, {
          stockAdult: infoTour.stockAdult - item.quantityAdult,
          stockChildren: infoTour.stockChildren - item.quantityChildren,
          stockBaby: infoTour.stockBaby - item.quantityBaby

        })
      }
    }
    req.body.paymentStatus = "unpaid";
    req.body.status = "initial";
    req.body.subTotal = req.body.items.reduce((sum, item) => {
      return sum + (item.priceNewAdult * item.quantityAdult) + (item.priceNewChildren * item.quantityChildren) + (item.priceNewBaby * item.quantityBaby)
    }, 0)
    req.body.discount = 0;
    req.body.total = req.body.subTotal - req.body.discount;
    const newRecord = new Order(req.body)
    await newRecord.save()
    res.json({
      code: "success",
      message: "Đặt hàng thành công!",
      orderId: newRecord.id
    })
  } catch (error) {
    console.log("Có lỗi tại controller order", error)
    res.json({
      code: "error",
      message: "Đặt hàng không thành công!"
    })
  }
}