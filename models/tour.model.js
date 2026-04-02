const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater')
mongoose.plugin(slug)
const tourSchema = new mongoose.Schema(
    {
        name: String,
        category: String,
        position: Number,
        priceChildren: Number,
        avatar: String,
        priceAdult: Number,
        priceBaby: Number,
        status: String,
        priceNewAdult: Number,
        priceNewChildren: Number,
        priceNewBaby: Number,
        stockAdult: Number,
        stockChildren: Number,
        stockBaby: Number,
        locations: Array,
        time: String,
        vehicle: String,
        departureDate: Date,
        information: String,
        schedules: Array,
        createdBy: String,
        updatedBy: String,
        deleted: {
            type: Boolean,
            default: false
        },
        deletedBy: String,
        deletedAt: Date,
        slug: {
            type: String,
            slug: "name",
            unique: true
        }
    }, { timestamps: true }
);
const Tour = mongoose.model('Tour', tourSchema, "tours");
module.exports = Tour;