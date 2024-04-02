const ProductCategory = require("../../models/product-category.model");

const createTree = require("../../helpers/createTree");

module.exports.category = async (req, res, next) => {
    try {
        const productCategories = await ProductCategory.find({
            deleted: false
        });
        const newProductCategories = createTree(productCategories);

        res.locals.layoutCategoryProducts = newProductCategories;
        next();

    } catch (error) {
        console.log("Error occurred in category middleware:", error);
        req.flash("error", "Error occurred, redirect back");
        res.redirect("back");
    }
}