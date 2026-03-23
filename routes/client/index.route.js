const routeTour = require('./tour.route')
const homeRoute = require('./home.route')
const cartRoute = require('./cart.route')
module.exports = (app) => {
    app.use('/tours', routeTour)
    app.use('/', homeRoute)
    app.use('/cart', cartRoute)
}