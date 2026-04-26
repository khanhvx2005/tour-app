const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    email: String,
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date,
    deletedBy: String

  }, { timestamps: true }
);
const Contact = mongoose.model('Contact', schema, "contacts");
module.exports = Contact;