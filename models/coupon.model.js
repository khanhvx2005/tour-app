const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    name: String,
    code: String,
    discountValue: Number,
    maxDiscountAmount: Number,
    quantity: Number,
    endDate: Date,
    createdBy: String,
    updatedBy: String,
    deletedBy: String,
    deletedAt: Date,
    deleted: {
      type: Boolean,
      default: false
    },
    status: String

  }, { timestamps: true }
);
const Coupon = mongoose.model('Coupon', schema, "coupons");
module.exports = Coupon;