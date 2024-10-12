const Bill = require("../../models/order.model");

const searchHelper = require("../../helpers/search");

// const filterStatusHelper = require("../../helpers/filterStatus");
// const searchHelper = require("../../helpers/search");
// const paginationHelper = require("../../helpers/pagination");


// Hỗ trợ route [GET] /admin/bills
module.exports.index = async (req, res) => {
    const objectSearch = searchHelper(req.query);
    // search
    let find = {};
    if (req.query.keyword) {
        find["userInfo.phone"] = objectSearch.regex;
    }

    // sort
    let sort = {};

    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort.position = "desc";
    }

    // Het sort

    const Bills = await Bill.find(find).sort(sort);

    // khi tiem thay san pham
    res.render("admin/pages/bills/index", {
        pageTitle: "Danh sách đơn hàng",
        bill: Bills,
        keyword: objectSearch.keyword,

    });
};