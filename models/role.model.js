const mongoose = require("mongoose");
const schema = new mongoose.Schema(
    {
        name: String,
        description: String,
        permissions: Array,
        deleted: {
            type: Boolean,
            default: false
        },
        createdBy: String,
        updatedBy: String,
        deletedBy: String,
        deletedAt: Date,
        slug: {
            type: String,
            slug: "name",
            unique: true
        }


    }, { timestamps: true }
);
const Role = mongoose.model('Role', schema, "roles");
module.exports = Role;