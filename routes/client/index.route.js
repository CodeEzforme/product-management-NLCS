const homeRoutes = require("./home.route");
const productRoutes = require("./product.route");

module.exports = (app) => {
    app.get("/", homeRoutes);

    app.use("/products", productRoutes);
}