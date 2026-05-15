const Coupon = require("../../models/coupon.model")
const moment = require('moment')
const AccountAdmin = require('../../models/account-admin.model')
module.exports.list = async (req, res) => {
  const couponList = await Coupon.find({
    deleted: false
  })
  // console.log(couponList)
  for (const item of couponList) {
    item.endDateFormat = moment(item.endDate).format("DD/MM/YYYY")
    item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY")
    item.updatedAtFormat = moment(item.updatedAt).format("HH:mm - DD/MM/YYYY")

    if (item.createdBy) {
      const infoAccountCreated = await AccountAdmin.findOne({
        _id: item.createdBy

      })
      if (infoAccountCreated) {
        item.createdByName = infoAccountCreated.fullName;
      }
    }
    if (item.updatedBy) {
      const infoAccountUpdated = await AccountAdmin.findOne({
        _id: item.updatedBy

      })
      if (infoAccountUpdated) {
        item.updatedByName = infoAccountUpdated.fullName;
      }
    }
  }
  res.render('admin/pages/coupon-list', {
    pageTitle: "Trang quản lý mã giảm giá",
    couponList: couponList
  })
}

module.exports.create = async (req, res) => {
  res.render('admin/pages/coupon-create', { pageTitle: "Trang tạo mới mã giảm giá" })
}

module.exports.createPost = async (req, res) => {


  req.body.discountValue = req.body.discountValue ? parseInt(req.body.discountValue) : 0;
  req.body.maxDiscountAmount = req.body.maxDiscountAmount ? parseInt(req.body.maxDiscountAmount) : 0;
  req.body.quantity = req.body.quantity ? parseInt(req.body.quantity) : 0;
  req.body.endDate = req.body.endDate ? new Date(req.body.endDate) : null;
  req.body.createdBy = req.account.id;
  req.body.updatedBy = req.account.id;

  const newCoupon = new Coupon(req.body)
  await newCoupon.save()
  req.flash("success", "Tạo mã giảm giá thành công!")
  res.json({
    code: "success",
    message: "Tạo mã giảm giá thành công"
  })
}

module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const couponDetail = await Coupon.findOne({
      _id: id,
      deleted: false
    })
    if (!couponDetail) {
      res.redirect(`/${pathAdmin}/coupon/list`)
      return;
    }
    couponDetail.endDateFormat = moment(couponDetail.endDate).format("YYYY-MM-DD")

    res.render('admin/pages/coupon-edit', {
      pageTitle: "Trang chỉnh sửa mã giảm giá",
      couponDetail: couponDetail
    })
  } catch (error) {
    console.log("Có lỗi tại chỉnh sửa mã giảm giá", error)
    res.redirect(`/${pathAdmin}/coupon/list`)
  }
}