const express = require('express')
const flash = require('express-flash')
const cookieParser = require('cookie-parser')
const expressSession = require('express-session')
const path = require('path')
require('dotenv').config() // or import 'dotenv/config' if you're using ES6
const database = require('./config/database');
const bodyParser = require('body-parser')
const adminRoute = require('./routes/admin/index.route')
const clientRoute = require("./routes/client/index.route")
const variableConfig = require('./config/variable')
const app = express()
const port = 3000
// Thiết lập pug
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, 'public')))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded())
app.use(express.json());
// parse application/json
app.use(bodyParser.json())
app.use(cookieParser('ABCDSADSA'));
app.use(expressSession({ cookie: { maxAge: 60000 } }));
app.use(flash());

app.locals.pathAdmin = variableConfig.pathAdmin;
global.pathAdmin = variableConfig.pathAdmin;
database.connect()
clientRoute(app);

adminRoute(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// mongodb+srv://khanhvuxuan292005_db_user:KjbF47m1zZKqwlP9@cluster0.yh2j7gk.mongodb.net/tour-management