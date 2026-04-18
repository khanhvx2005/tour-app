const slugify = require("slugify")
const moment = require("moment")
module.exports.buildSearchQuery = (query) => {
    const find = {
        deleted: false,
        status: "active"
    }
    // Điểm khởi hành
    if (query.locationFrom) {
        find.locations = query.locationFrom;
    }
    // Điểm đến
    if (query.locationTo) {
        const locationToSlug = slugify(query.locationTo, {
            lower: true,
            strict: true,
            trim: true
        })
        find.slug = new RegExp(locationToSlug, "i");
    }
    const stockTypes = ["stockAdult", "stockChildren", "stockBaby"]
    stockTypes.forEach((item) => {
        if (query[item] && !isNaN(query[item])) {
            find[item] = {}
            find[item]['$gte'] = parseInt(query[item])
        }
    })
    // Ngày khởi hành
    if (query.departureDate) {
        find.departureDate = new Date(query.departureDate)

    }
    // End ngày khởi hành

    // Khoảng giá
    if (query.price) {
        const [priceMin, priceMax] = query.price.split("-").map((item) => parseInt(item));
        if (!isNaN(priceMin) && !isNaN(priceMax)) {
            find.priceNewAdult = {
                $gte: priceMin,
                $lte: priceMax
            }
        }

    }
    return find;
}