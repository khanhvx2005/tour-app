const Coupon = require("../../models/coupon.model");

module.exports.detail = async (req, res) => {
  try {
    const { coupon } = req.body;
    const existsCoupon = await Coupon.findOne({
      code: coupon,
      deleted: false,
      status: "active"
    })
    if (!existsCoupon) {
      res.json({
        code: "error",
        message: "Mã giảm giá không tồn tại hoặc chưa được kích hoạt!"
      })
      return;
    }
    if (existsCoupon.quantity <= 0) {
      res.json({
        code: "error",
        message: "Mã giảm giá này đã hết lượt sử dụng"
      })
      return;
    }
    const currentTime = new Date();
    // Nếu thời gian hiện tại lớn hơn ngày kết thúc -> Hết hạn
    if (existsCoupon && existsCoupon.endDate && currentTime > existsCoupon.endDate) {
      res.json({
        code: "error",
        message: "Mã giảm giá này đã hết hạn chương trình."
      })
      return;
    }

    res.json({
      code: "success",
      message: "Thành công!",
      couponDetail: existsCoupon
    })
  } catch (error) {
    console.error("Lỗi khi kiểm tra mã giảm giá:", error);
    res.json({
      code: "error",
      message: "Lỗi máy chủ nội bộ. Vui lòng thử lại sau!",
    })
  }
}