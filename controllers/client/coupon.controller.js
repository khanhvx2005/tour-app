const Coupon = require("../../models/coupon.model");

module.exports.detail = async (req, res) => {
  const { coupon } = req.body;
  const exitsCoupon = await Coupon.findOne({
    code: coupon,
    deleted: false,
    status: "active"
  }).select('code discountValue maxDiscountAmount name quantity')
  if (!exitsCoupon) {
    res.json({
      code: "error",
      message: "Mã giảm giá không hợp lệ!"
    })
    return;
  }

  res.json({
    code: "success",
    message: "Thành công!",
    couponDetail: exitsCoupon
  })
}