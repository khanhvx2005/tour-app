const routeTour = require('./tour.route')
const homeRoute = require('./home.route')
const cartRoute = require('./cart.route')
const settingMiddleware = require('../../middlewares/client/setting.middleware')
module.exports = (app) => {
    app.use(settingMiddleware.websiteInfo)
    app.use('/tours', routeTour)
    app.use('/', homeRoute)
    app.use('/cart', cartRoute)
}