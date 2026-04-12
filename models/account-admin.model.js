const mongoose = require("mongoose");
const accountAdminSchema = new mongoose.Schema(
    {
        fullName: String,
        email: String,
        password: String,
        status: String,
        deleted: {
            type: Boolean,
            default: false
        },
        avatar: String,
        phone: String,
        role: String,
        positionCompany: String,
        createdBy: String,
        updatedBy: String,
        deletedBy: String,
        deletedAt: Date
    }, { timestamps: true }
);
const AccountAdmin = mongoose.model('AccountAdmin', accountAdminSchema, "accounts-admin");
module.exports = AccountAdmin;