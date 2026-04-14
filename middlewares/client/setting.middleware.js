const WebsiteInfo = require("../../models/setting-website-info.model")

module.exports.websiteInfo = async (req, res, next) => {
    const infoWebsite = await WebsiteInfo.findOne({})
    res.locals.infoWebsite = infoWebsite;
    next()
}