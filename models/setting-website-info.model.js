const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    websiteName: String,
    phone: String,
    email: String,
    address: String,
    logo: String,
    favicon: String,
    facebook: String,
    updatedBy: String
  }, { timestamps: true }
);
const WebsiteInfo = mongoose.model('WebsiteInfo', schema, "setting-website-info");
module.exports = WebsiteInfo;