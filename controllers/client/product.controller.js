const Product = require("../../models/product.model");

// hỗ trợ router [GET] /products
module.exports.index = async(req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({ position: "desc" });

    const newProducts =  products.map(item => {
        item.priceNew = ((item.price * (100 - item.discountPercentage)) / 100).toFixed(0);

        return item;
    });


    res.render("client/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: newProducts
    });
}

// hỗ trợ router [GET] /products/detail/:slug
module.exports.detail = async(req, res) => {

    try {
        const slug = req.params.slug;

        const product = await Product.findOne({
            slug: slug,
            deleted: false,
            status: "active"
        });

        res.render("client/pages/products/detail", {
            pageTitle: "Chi tiết sản phẩm",
            product: product
        });
    } catch (e) {
        res.redirect("/");
    }
}