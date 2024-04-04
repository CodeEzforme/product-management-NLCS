const Product = require("../../models/product.model");

const productsHelper = require("../../helpers/product");

// [GET] /client/search
module.exports.index = async (req, res) => {
    try {
        const keyword = req.query.keyword;

        let newProducts = [];

        if (keyword) {
            const keywordRegex = new RegExp(keyword, "i");

            const products = await Product.find({
                title: keywordRegex,
                deleted: false,
                status: "active"
            })

            newProducts = productsHelper.productsNewPrice(products);
        }

        res.render("client/pages/search/index.pug", {
            pageTitle: 'Kết quả tìm kiếm',
            keyword: keyword,
            products: newProducts
        })

    } catch (error) {
        console.log("ERROR OCCURRED:", error);
        res.redirect("back");
    }
}