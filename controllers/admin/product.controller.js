const Product = require("../../models/product.mode");

const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

// Hỗ trợ route [GET] /admin/products /////////////
module.exports.index = async(req, res) => {

    const filterStatus = filterStatusHelper(req.query);
    const objectSearch = searchHelper(req.query);

    let find = {
        deleted: false,
    };

    if(req.query.status){
        find.status = req.query.status;
    }

    if(req.query.keyword){
        find.title = objectSearch.regex;
    }


    // Pagination
    let initPagination = {
        currentPage: 1,
        limitItems: 8
    };
    const countProducts = await Product.countDocuments(find);
    const objectPagination = paginationHelper(req.query, countProducts, initPagination);
    // hết Pagination


    const products = await Product.find(find)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    res.render("admin/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}