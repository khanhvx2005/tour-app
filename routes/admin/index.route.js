const accountRoutes = require('./account.route')
const variableConfig = require('../../config/variable')
const dashboardRoutes = require('./dashboard.route')
const categoryRoutes = require('./category.route')
const tourRoutes = require('./tour.route')
const orderRoutes = require('./order.route')
const userRoutes = require('./user.route')
const contactRoutes = require('./contact.route')
const settingRoutes = require('./setting.route')
const profileRoutes = require('./profile.route')
const authMiddleware = require("../../middlewares/admin/auth.middleware")
module.exports = (app) => {
    app.use(`/${pathAdmin}/account`, accountRoutes)
    app.use(`/${pathAdmin}/dashboard`, authMiddleware.verifyToken, dashboardRoutes)
    app.use(`/${pathAdmin}/category`, authMiddleware.verifyToken, categoryRoutes)
    app.use(`/${pathAdmin}/tour`, authMiddleware.verifyToken, tourRoutes)
    app.use(`/${pathAdmin}/order`, authMiddleware.verifyToken, orderRoutes)
    app.use(`/${pathAdmin}/user`, authMiddleware.verifyToken, userRoutes)
    app.use(`/${pathAdmin}/contact`, authMiddleware.verifyToken, contactRoutes)
    app.use(`/${pathAdmin}/setting`, authMiddleware.verifyToken, settingRoutes)
    app.use(`/${pathAdmin}/profile`, authMiddleware.verifyToken, profileRoutes)
    app.use(authMiddleware.verifyToken, (req, res) => {
        res.render('admin/pages/error-404', { titlePage: "404 not found" })
    });

}