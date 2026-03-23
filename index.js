const express = require('express')
const path = require('path')
const database = require('./config/database');
require('dotenv').config() // or import 'dotenv/config' if you're using ES6
const clientRoute = require("./routes/client/index.route");
const adminRoute = require('./routes/admin/index.route')
const app = express()
const port = 3000
// Thiết lập pug
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, 'public')))
app.locals.pathAdmin = "admin";
database.connect();
adminRoute(app);
clientRoute(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// mongodb+srv://khanhvuxuan292005_db_user:KjbF47m1zZKqwlP9@cluster0.yh2j7gk.mongodb.net/tour-management