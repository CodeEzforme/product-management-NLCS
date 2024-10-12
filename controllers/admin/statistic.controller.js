const Cart = require("../../models/cart.model");

// const filterStatusHelper = require("../../helpers/filterStatus");
// const searchHelper = require("../../helpers/search");
// const paginationHelper = require("../../helpers/pagination");


// Hỗ trợ route [GET] /admin/statistics
module.exports.index = async (req, res) => {
    const Carts = await Cart.find();
    console.log("hello!");
    // khi tiem thay san pham
    res.render("admin/pages/statistics/index", {
        pageTitle: "Thông kê doanh thu",
        Carts: Carts
    });
};