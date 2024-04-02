const Product = require('../../models/product.model');
// const ProductCategory = require('../../models/product-category.model');


const productsHelper = require("../../helpers/product");
// const createTree = require('../../helpers/createTree');

// [GET] /
module.exports.index = async (req, res) => {
  try {
    // Hiển thị danh sách sản phẩm nổi bật
    const featuredProducts = await Product.find({
      deleted: false,
      status: "active",
      featured: "1"
    }).sort({
      position: "desc"
    }).limit(6);
    const newFeaturedProducts = productsHelper.productsNewPrice(featuredProducts);
    // Hết hiển thị danh sách sản phẩm nổi bật

    // const categoryProducts = await ProductCategory.find({
    //   deleted: false,
    // });
    // const newCategoryProducts = createTree(categoryProducts);

    // Hiển thị danh sách nổi bật mới nhất
    const newProducts = await Product.find({
      deleted: false,
      status: "active", 
    }).sort({ position: "desc" }).limit(6);

    const newProductsNew = productsHelper.productsNewPrice(newProducts)
    // Hết hiển thị danh sách nổi bật mới nhất

    // console.log(newCategoryProducts);
    res.render("client/pages/home/index", {
      pageTitle: 'Trang chủ',
        featuredProducts: newFeaturedProducts,
        // layoutCategoryProducts: newCategoryProducts
        newProducts: newProductsNew
    })

  } catch (error) {
    console.log("ERROR OCCURRED:", error);
    req.flash("error", "Error occured, page is not exists");
    res.redirect('back');
  }
}