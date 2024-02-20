const express  = require("express");
const methodOverride = require('method-override');
var bodyParser = require('body-parser')
require('dotenv').config();

const database = require("./config/database");
const systemConfig = require("./config/system");

database.connect();

const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");

const app = express();
const port = process.env.PORT;

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static('public'));

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// biến toàn cục
app.locals.prefixAdmin = systemConfig.prefixAdmin;

//routes
routeAdmin(app);
route(app);



app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
