const express = require('express')
require('dotenv').config() // or import 'dotenv/config' if you're using ES6

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const variableConfig = require('./config/variable')
const path = require('path')
const database = require('./config/database');
const adminRoute = require('./routes/admin/index.route')
const clientRoute = require("./routes/client/index.route");
const app = express()
const port = 3000
// Thiết lập pug
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, 'public')))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded())
// parse application/json
app.use(bodyParser.json())
app.use(cookieParser())
app.locals.pathAdmin = variableConfig.pathAdmin;
global.pathAdmin = variableConfig.pathAdmin;
database.connect();
adminRoute(app);
clientRoute(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// mongodb+srv://khanhvuxuan292005_db_user:KjbF47m1zZKqwlP9@cluster0.yh2j7gk.mongodb.net/tour-management