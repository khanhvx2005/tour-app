const routeTour = require('./tour.route')
const homeRoute = require('./home.route')
const cartRoute = require('./cart.route')
const settingMiddleware = require('../../middlewares/client/setting.middleware')
const categoryMiddleware = require('../../middlewares/client/category.middleware')
const contactRoute = require('./contact.route')
const categoryRoute = require('./category.route')
const searchRoute = require('./search.route')
module.exports = (app) => {
    app.use(settingMiddleware.websiteInfo)
    app.use(categoryMiddleware.category)
    app.use('/tours', routeTour)
    app.use('/', homeRoute)
    app.use('/cart', cartRoute)
    app.use('/contact', contactRoute)
    app.use('/category', categoryRoute)
    app.use('/search', searchRoute)

}