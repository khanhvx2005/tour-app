const Order = require("../../models/order.model")
const variableConfig = require('../../config/variable')
const moment = require("moment")
const City = require("../../models/city.model")
module.exports.list = async (req, res) => {
  const find = {
    deleted: false
  }
  const orderList = await Order
    .find(find)
    .sort({
      createdAt: 'desc'
    })
  for (const orderDetail of orderList) {
    orderDetail.paymentMethodName = variableConfig.paymentMethod.find(item => item.value == orderDetail.paymentMethod).label;
    orderDetail.paymentStatusName = variableConfig.paymentStatus.find(item => item.value == orderDetail.paymentStatus).label;
    orderDetail.statusName = variableConfig.status.find(item => item.value == orderDetail.status).label;

    orderDetail.createAtTime = moment(orderDetail.createdAt).format("HH:mm")
    orderDetail.createAtDate = moment(orderDetail.createdAt).format("DD/MM/YYYY")

  }
  res.render("admin/pages/order-list", {
    pageTitle: "Quản lý đơn hàng",
    orderList: orderList
  })
}
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const orderDetail = await Order.findOne({
      _id: id,
      deleted: false
    })
    if (!orderDetail) {
      res.redirect(`/${pathAdmin}/order/list`)
      return;
    }
    orderDetail.createdAtFormat = moment(orderDetail.createdAt).format("YYYY-MM-DDTHH:mm")
    for (const item of orderDetail.items) {
      item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY")
      const city = await City.findOne({
        _id: item.locationFrom
      })
      if (city) {
        item.locationFromName = city.name;

      }
    }
    // console.log(orderDetail)
    res.render("admin/pages/order-edit", {
      pageTitle: `Chỉnh sửa đơn hàng ${orderDetail.orderCode}`,
      orderDetail: orderDetail,
      paymentMethod: variableConfig.paymentMethod,
      paymentStatus: variableConfig.paymentStatus,
      status: variableConfig.status
    })
  } catch (error) {
    console.log(error)
    res.redirect(`/${pathAdmin}/order/list`)
  }

}
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    req.body.updatedBy = req.account.id;
    await Order.updateOne({
      _id: id
    }, req.body)
    req.flash("success", "Cập nhập thành công")
    res.json({
      code: "success",
    })
  } catch (error) {
    console.log(error)
    res.json({
      code: "error",
      message: "Thông tin đơn hàng không hợp lệ"
    })
  }

}