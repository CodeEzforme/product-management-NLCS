const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");

const productsHelper = require("../../helpers/product");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

// hỗ trợ router [GET] /products
module.exports.index = async (req, res) => {
  // const products = await Product.find({
  //     status: "active",
  //     deleted: false
  // }).sort({ position: "desc" });

  /// pagination////////////////////////////////
  const objectSearch = searchHelper(req.query);
  let find = {
    deleted: false,
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  if (req.query.keyword) {
    find.title = objectSearch.regex;
  }

  // Pagination
  let initPagination = {
    currentPage: 1,
    limitItems: 9
  };
  const countProducts = await Product.countDocuments(find);
  const objectPagination = paginationHelper(req.query, countProducts, initPagination);
  // hết Pagination

  // sort
  let sort = {};

  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  // Het sort

  const products = await Product.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);
  /// pagination////////////////////////////////

  const newProducts = productsHelper.productsNewPrice(products);


  res.render("client/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: newProducts,
    keyword: objectSearch.keyword,
    pagination: objectPagination
  });
}

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
  try {
    // Pagination
    let find = {
      deleted: false,
    };
    let initPagination = {
      currentPage: 1,
      limitItems: 8
    }
    /// pagination////////////////////////////////

    const slugCategory = req.params.slugCategory;

    const category = await ProductCategory.findOne({
      slug: slugCategory,
      deleted: false,
      status: "active"
    })

    const getSubCategories = async (parentId) => {
      const subs = await ProductCategory.find({
        parent_id: parentId,
        deleted: false,
        status: 'active'
      })

      let allSub = [...subs];

      for (const sub of subs) {
        const childs = await getSubCategories(sub.id);
        allSub = allSub.concat(childs);
      }

      return allSub;
    }

    const subCategoriesList = await getSubCategories(category.id);

    const subCategoriesIdList = subCategoriesList.map(item => item.id)
    // let sort = {};

    // if (req.query.sortKey && req.query.sortValue) {
    //     sort[req.query.sortKey] = req.query.sortValue;
    // } else {
    //     sort.position = "desc";
    // }

    const products = await Product.find({
      product_category_id: {
        $in: [category.id, ...subCategoriesIdList]
      },
      deleted: false,
      status: "active"
    }).sort({
      position: "desc"
    });

    // paninations
    const countProducts = products.length;
    const objectPagination = paginationHelper(req.query, countProducts, initPagination);
    ///paninations

    const newProducts = productsHelper.productsNewPrice(products);

    res.render("client/pages/products/index", {
      pageTitle: category.title,
      products: newProducts,
      pagination: objectPagination
    })

  } catch (error) {
    console.log("ERROR OCCURRED:", error);
    req.flash('error', 'Error occurred, directed to home page');
    res.redirect("back");
  }
}

// hỗ trợ router [GET] /products/detail/:slugProduct
module.exports.detail = async (req, res) => {
  try {
    const slug = req.params.slugProduct;

    const product = await Product.findOne({
      slug: slug,
      deleted: false,
      status: "active"
    });











    if (product.product_category_id) {
      const category = await ProductCategory.findOne({
        _id: product.product_category_id,
        deleted: false,
        status: "active"
      });

      product.category = category;
    }

    product.newPrice = productsHelper.productNewPrice(product);

    res.render("client/pages/products/detail", {
      pageTitle: "Chi tiết sản phẩm",
      product: product
    });
  } catch (e) {
    res.redirect("/");
  }
}