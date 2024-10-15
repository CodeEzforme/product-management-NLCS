const Bill = require("../../models/order.model");

const searchHelper = require("../../helpers/search");
const filterPayMentHelper = require("../../helpers/filterPayMent");

// const filterStatusHelper = require("../../helpers/filterStatus");
// const searchHelper = require("../../helpers/search");
// const paginationHelper = require("../../helpers/pagination");


// Hỗ trợ route [GET] /admin/bills
module.exports.index = async (req, res) => {
    const objectSearch = searchHelper(req.query);
    const filterPayMent = filterPayMentHelper(req.query);
    // search
    let find = {};

    if (req.query.status) {
        find.status = req.query.status;
    }

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
        filterStatus: filterPayMent,
    });
};

// [PATH] /admin/bills/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    await Bill.updateOne({
        _id: id
    }, {
        status: status,
        $push: {
            updatedBy: updatedBy
        }
    });

    req.flash("success", "Cập nhật trạng thái thành công!");
    res.redirect("back");
};