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

module.exports = (app) => {
    app.use(`/${variableConfig.pathAdmin}/account`, accountRoutes)
    app.use(`/${variableConfig.pathAdmin}/dashboard`, dashboardRoutes)
    app.use(`/${variableConfig.pathAdmin}/category`, categoryRoutes)
    app.use(`/${variableConfig.pathAdmin}/tour`, tourRoutes)
    app.use(`/${variableConfig.pathAdmin}/order`, orderRoutes)
    app.use(`/${variableConfig.pathAdmin}/user`, userRoutes)
    app.use(`/${variableConfig.pathAdmin}/contact`, contactRoutes)
    app.use(`/${variableConfig.pathAdmin}/setting`, settingRoutes)
    app.use(`/${variableConfig.pathAdmin}/profile`, profileRoutes)
    app.use((req, res) => {
        res.render('admin/pages/error-404', { titlePage: "404 not found" })
    });

}