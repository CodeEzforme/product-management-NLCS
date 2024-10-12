const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");

const systemConfig = require("../../config/system");

const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const createTree = require("../../helpers/createTree");

// Hỗ trợ route [GET] /admin/products
module.exports.index = async (req, res) => {
    const filterStatus = filterStatusHelper(req.query);
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
        limitItems: 8
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

    for (const product of products) {
        // lấy ra người tạo
        const userCreated = await Account.findOne({
            _id: product.createdBy.account_id
        });

        if (userCreated) {
            product.createdBy.accountFullName = userCreated.fullName;
        }

        // Lấy ra người sữa
        const userUpdatedId = product.updatedBy.slice(-1)[0];
        if (userUpdatedId) {
            const userUpdated = await Account.findOne({
                _id: userUpdatedId.account_id
            });

            if (userUpdated) {
                userUpdatedId.accountFullName = userUpdated.fullName;
            }
        }
    }
    // khi tiem thay san pham
    res.render("admin/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
};

// [PATH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    // Trường hợp kẻ sấu tấn công
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("products_edit")) {
        req.flash("error", "Không có quyền cập nhật trạng thái!");
        return res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
    //HẾT TẤN CÔNG

    const status = req.params.status;
    const id = req.params.id;

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    await Product.updateOne({
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

// [PATH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    const permissions = res.locals.role.permissions;

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    switch (type) {
        case "active":
            if (!permissions.includes("products_edit")) {
                req.flash("error", "Không có quyền cập nhật trạng thái!");
                return res.redirect(`/${systemConfig.prefixAdmin}/products`);
            }
            case "inactive":
                if (!permissions.includes("products_edit")) {
                    req.flash("error", "Không có quyền cập nhật trạng thái!");
                    return res.redirect(`/${systemConfig.prefixAdmin}/products`);
                }
                await Product.updateMany({
                    _id: {
                        $in: ids
                    }
                }, {
                    $push: {
                        updatedBy: updatedBy
                    },
                    status: type
                });
                req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
                break;
            case "delete-all":
                if (!permissions.includes("products_delete")) {
                    req.flash("error", "Không có quyền Xóa sản phẩm!");
                    return res.redirect(`/${systemConfig.prefixAdmin}/products`);
                }
                await Product.updateMany({
                    _id: {
                        $in: ids
                    }
                }, {
                    deleted: true,
                    deletedBy: {
                        account_id: res.locals.user.id,
                        deletedAt: new Date(),
                    }
                });
                req.flash("success", `Xóa thành công ${ids.length} sản phẩm!`);
                break;
            case "change-position":
                if (!permissions.includes("products_edit")) {
                    req.flash("error", "Không có quyền thay đổi vị trí!");
                    return res.redirect(`/${systemConfig.prefixAdmin}/products`);
                }
                for (const item of ids) {
                    const [id, position] = item.split("-");
                    await Product.updateOne({
                        _id: id
                    }, {
                        $push: {
                            updatedBy: updatedBy
                        },
                        position: position
                    });
                }
                req.flash("success", `Thay đổi vị trí thành công ${ids.length} sản phẩm!`);
                break;
            default:
                break;
    }
    res.redirect("back");
};

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    await Product.updateOne({
        _id: id
    }, {
        deleted: true,
        deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date(),
        }
    });
    req.flash("success", `Xóa thành công sản phẩm!`);
    res.redirect("back");
};

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    }

    const records = await ProductCategory.find(find);

    const newRecords = createTree(records);

    res.render("admin/pages/products/create", {
        pageTitle: "Tạo mới sản phẩm",
        records: newRecords
    });
};

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    // Trường hợp kẻ sấu tấn công từ postman gửi lệnh post lên
    const permissions = res.locals.role.permissions;

    if (!permissions.includes("products_create"))
        return;
    // Hết tấn công từ postman

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if (req.body.position === "") {
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    req.body.createdBy = {
        account_id: res.locals.user.id
    };

    // Hết upload nhiều ảnh

    const product = new Product(req.body);
    await product.save();

    req.flash("success", "Sản phẩm đã được thêm!");
    res.redirect(`/${systemConfig.prefixAdmin}/products`);
};

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        const product = await Product.findOne({
            _id: id,
            deleted: false
        });

        let find = {
            deleted: false
        }

        const records = await ProductCategory.find(find);

        const newRecords = createTree(records);

        res.render("admin/pages/products/edit", {
            pageTitle: "Chỉnh sửa sản phẩm",
            product: product,
            records: newRecords
        });
    } catch (err) {
        req.flash("error", "Không tồn tại sản phẩm!");
        res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
    // problem try catch
};

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    0
    req.body.position = parseInt(req.body.position);

    // if (req.file && req.file.filename) {
    //     req.body.thumbnail = `/uploads/${req.file.filename}`;
    // }

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    await Product.updateOne({
        _id: id,
    }, {
        ...req.body,
        $push: {
            updatedBy: updatedBy
        }
    });

    req.flash("success", "Cập nhật sản phẩm thành công!");

    res.redirect("back");
};

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;

        const product = await Product.findOne({
            _id: id,
            deleted: false
        });

        res.render("admin/pages/products/detail", {
            pageTitle: "Chi tiết sản phẩm",
            product: product
        });
    } catch (err) {
        req.flash("error", "Không tồn tại sản phẩm!");
        res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
};