const ProductCategory = require("../../models/product-category.model");

const systemConfig = require("../../config/system");

const createTree = require("../../helpers/createTree");
const { response } = require("express");

// Hỗ trợ route [GET] /admin/products-category
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }

    const records = await ProductCategory.find(find);

    const newRecords = createTree(records);

    res.render("admin/pages/products-category/index", {
        pageTitle: "Danh mục sản phẩm",
        records: newRecords,
    });
}

// Hỗ trợ route [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    }

    const records = await ProductCategory.find(find);

    const newRecords = createTree(records);

    res.render("admin/pages/products-category/create", {
        pageTitle: "Tạo danh mục sản phẩm",
        records: newRecords
    });
}

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
    if (req.body.position === "") {
        const countRecords = await ProductCategory.countDocuments();
        req.body.position = countRecords + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    const product = new ProductCategory(req.body);
    await product.save();

    req.flash("success", `Tạo danh mục sản phẩm thành công!`);
    res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
};

// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id;

    const data = await ProductCategory.findOne({
        _id: id,
        deleted: false
    });

    const records = await ProductCategory.find({
        deleted: false
    });

    const newRecords = createTree(records);

    res.render("admin/pages/products-category/edit", {
        pageTitle: "Chỉnh sửa Danh mục sản phẩm",
        data: data,
        records: newRecords
    });
};

// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    if (req.body.position === "") {
        const countRecords = await ProductCategory.countDocuments();
        req.body.position = countRecords;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    await ProductCategory.updateOne({
        _id: id
    }, req.body);

    req.flash("success", `Chỉnh sửa danh mục sản phẩm thành công!`);
    res.redirect("back");
};

// [GET] /admin/products-category/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await ProductCategory.findOne({
            _id: id
        });

        res.render("admin/pages/products-category/detail", {
            pageTitle: "Chi tiết danh mục sản phẩm",
            data: data
        })

    } catch (error) {
        console.log("ERROR OCCURED:", error);
        req.flash("error", "Error occured, can not get data");
        res.redirect("back");
    }
}

// [DELETE] /admin/products-category/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    await ProductCategory.updateOne({
        _id: id
    }, {
        deleted: true,
        deletedAt: Date()
    });

    req.flash("success", `Xóa danh mục sản phẩm thành công!`);
    res.redirect('back');
}