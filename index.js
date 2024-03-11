const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const cookieParser = require("cookie-parser")
const session = require("express-session");
require('dotenv').config();

const database = require("./config/database");
const systemConfig = require("./config/system");

database.connect();

const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");

const app = express();
const port = process.env.PORT;

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// Flash
app.use(cookieParser("LGASGFSAADSJFD"));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// Hết Flash

app.use(express.static(`${__dirname}/public`));

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

// biến toàn cục
app.locals.prefixAdmin = systemConfig.prefixAdmin;

//routes
routeAdmin(app);
route(app);



app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});