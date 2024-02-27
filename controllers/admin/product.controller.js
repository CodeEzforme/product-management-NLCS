const Product = require("../../models/product.mode");

const systemConfig = require("../../config/system");

const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

// Hỗ trợ route [GET] /admin/products
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
        .sort({ position: "desc" })
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    // khi tiem thay san pham
    res.render("admin/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}

// [PATH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({ _id: id }, { status: status });

    res.redirect("back");
}

// [PATH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "active":
        case "inactive":
            await Product.updateMany({ _id: {$in: ids} }, { status: type });
            break;
        case "delete-all":
            await Product.updateMany({ _id: {$in: ids} }, { 
                deleted: true,
                deletedAt: new Date()
            });
            break;
        case "change-position":
            for (const item of ids) {
                const [id, position] = item.split("-");
                await Product.updateOne({ _id: id }, { position: position });
            }
            break;
        default:
            break;
    }
    res.redirect("back");
}

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    await Product.updateOne({ _id: id }, {
        deleted: true,
        deletedAt: new Date()
    });

    res.redirect("back");
}