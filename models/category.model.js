const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater')
mongoose.plugin(slug)
const schema = new mongoose.Schema(
  {
    name: String,
    parent: String,
    position: Number,
    status: String,
    avatar: String,
    description: String,
    deleted: {
      type: Boolean,
      default: false
    },
    slug: {
      type: String,
      slug: "name",
      unique: true
    },
    createdBy: String,
    updatedBy: String,// Lưu người cập nhập gần nhất còn muốn lưu lịch sử tất cả những ng cập nhập thì lưu dưới dạng array
    deletedBy: String,
    deletedAt: Date
  }, { timestamps: true }
);
const Category = mongoose.model('Category', schema, "categories");
module.exports = Category;