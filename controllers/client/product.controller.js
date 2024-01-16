const Product = require("../../models/product.mode");

module.exports.index = async(req, res) => {
    const products = await Product.find({});

    console.log(products);

    const newProducts =  products.map(item => {
        item.priceNew = ((item.price * (100 - item.discountPercentage)) / 100).toFixed(0);

        return item;
    });



    res.render("client/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: newProducts
    });
}