const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    orderCode: String,
    fullName: String,
    phone: String,
    note: String,
    items: Array,
    paymentMethod: String,
    paymentStatus: String,
    status: String,
    subTotal: Number,
    discount: Number,
    total: Number,
    deleted: {
      type: Boolean,
      default: false
    },
    updatedBy: String,
    deletedBy: String,
    deletedAt: Date

  }, { timestamps: true }
);
const Order = mongoose.model('Order', schema, "orders");
module.exports = Order;