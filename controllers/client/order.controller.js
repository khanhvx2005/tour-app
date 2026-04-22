const Order = require("../../models/order.model");
const Tour = require("../../models/tour.model")
const City = require('../../models/city.model')
const generateHelper = require('../../helpers/generate.helper')
const variableHelper = require('../../config/variable')
const moment = require('moment')
module.exports.createPost = async (req, res) => {

  try {
    req.body.orderCode = "OD" + generateHelper.generateRandomNumber(10)
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
module.exports.success = async (req, res) => {
  const { orderId, phone } = req.query;
  try {
    const orderDetail = await Order.findOne({
      _id: orderId,
      phone: phone,
      deleted: false
    })
    if (!orderDetail) {
      res.redirect('/')
      return;
    }
    orderDetail.paymentMethodName = variableHelper.paymentMethod.find(item => item.value == orderDetail.paymentMethod).label;
    orderDetail.paymentStatusName = variableHelper.paymentStatus.find(item => item.value == orderDetail.paymentStatus).label;
    orderDetail.statusName = variableHelper.status.find(item => item.value == orderDetail.status).label;
    orderDetail.createdAtFormat = moment(orderDetail.createdAt).format("DD/MM/YYYY")
    for (const item of orderDetail.items) {
      const infoTour = await Tour.findOne({
        _id: item.tourId,
        deleted: false
      })

      if (infoTour) {
        item.slug = infoTour.slug;
      }
      const city = await City.findOne({
        _id: item.locationFrom
      })
      item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY")
      if (city) {
        item.locationFromName = city.name;

      }
    }
    res.render('client/pages/order-success', {
      pageTitle: "Trang đặt hàng thành công",
      orderDetail: orderDetail
    })
  } catch (error) {
    res.redirect('/')
  }
}