const Bill = require("../../models/order.model");

// const filterStatusHelper = require("../../helpers/filterStatus");
// const searchHelper = require("../../helpers/search");
// const paginationHelper = require("../../helpers/pagination");

// Hỗ trợ route [GET] /admin/bills
module.exports.index = async (req, res) => {


    // const filterStatus = filterStatusHelper(req.query);
    // const objectSearch = searchHelper(req.query);

    // let find = {
    //     deleted: false,
    // };

    // if (req.query.status) {
    //     find.status = req.query.status;
    // }

    // if (req.query.keyword) {
    //     find.title = objectSearch.regex;
    // }

    // // Pagination
    // let initPagination = {
    //     currentPage: 1,
    //     limitItems: 8
    // };
    // const countProducts = await Bill.countDocuments(find);

    const Bills = await Bill.find();

    // console.log(Bills[0].userInfo.fullName);
    // const objectPagination = paginationHelper(req.query, countProducts, initPagination);
    // hết Pagination

    // // sort
    // let sort = {};

    // if (req.query.sortKey && req.query.sortValue) {
    //     sort[req.query.sortKey] = req.query.sortValue;
    // } else {
    //     sort.position = "desc";
    // }
    // // Het sort

    // const products = await Product.find(find)
    //     .sort(sort)
    //     .limit(objectPagination.limitItems)
    //     .skip(objectPagination.skip);

    // for (const product of products) {
    //     // lấy ra người tạo
    //     const userCreated = await Account.findOne({
    //         _id: product.createdBy.account_id
    //     });

    //     if (userCreated) {
    //         product.createdBy.accountFullName = userCreated.fullName;
    //     }

    //     // Lấy ra người sữa
    //     const userUpdatedId = product.updatedBy.slice(-1)[0];
    //     if (userUpdatedId) {
    //         const userUpdated = await Account.findOne({
    //             _id: userUpdatedId.account_id
    //         });

    //         if (userUpdated) {
    //             userUpdatedId.accountFullName = userUpdated.fullName;
    //         }
    //     }
    // }
    // khi tiem thay san pham
    res.render("admin/pages/bills/index", {
        pageTitle: "Danh sách đơn hàng",
        bill: Bills,
        // filterStatus: filterStatus,
        // keyword: objectSearch.keyword,
        // pagination: objectPagination
    });
};