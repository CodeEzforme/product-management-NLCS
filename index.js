const express  = require("express");
require('dotenv').config();

const route = require("./routes/client/index.route");

const app = express();



app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static('public'))


//routes
route(app);


app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
