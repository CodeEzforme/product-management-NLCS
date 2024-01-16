const Product = require("../../models/product.mode");

// Hỗ trợ route [GET] /admin/products
module.exports.index = async(req, res) => {
    const products = await Product.find({
        deleted: false
    });

    res.render("admin/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products
    });
}