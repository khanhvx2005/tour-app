const Order = require("../../models/order.model")
const variableConfig = require('../../config/variable')
const moment = require("moment")
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

  res.render("admin/pages/order-edit", {
    pageTitle: "Chỉnh sửa đơn hàng",
  })
}