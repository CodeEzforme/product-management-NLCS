const ProductCategories = require('../../models/product-category.model');
const Products = require('../../models/product.model');
const Accounts = require('../../models/account.model');
const Users = require('../../models/user.model');
const mongoose = require("mongoose");


// [GET] /admin/dashboard
module.exports.dashboard = async (req, res) => {
    const statistics = {
        productCategories: {
            total: 0,
            active: 0,
            inactive: 0
        },
        products: {
            total: 0,
            active: 0,
            inactive: 0
        },
        adminAccounts: {
            total: 0,
            active: 0,
            inactive: 0
        },
        clientAccounts: {
            total: 0,
            active: 0,
            inactive: 0
        },
    }

    // Product categories
    statistics.productCategories.total = await ProductCategories.countDocuments({
        deleted: false
    });

    statistics.productCategories.active = await ProductCategories.countDocuments({
        status: 'active',
        deleted: false
    });

    statistics.productCategories.inactive = await ProductCategories.countDocuments({
        status: 'inactive',
        deleted: false
    });

    // Products
    statistics.products.total = await Products.countDocuments({
        deleted: false
    });

    statistics.products.active = await Products.countDocuments({
        status: 'active',
        deleted: false
    });

    statistics.products.inactive = await Products.countDocuments({
        status: 'inactive',
        deleted: false
    });

    // Admin accounts
    statistics.adminAccounts.total = await Accounts.countDocuments({
        deleted: false
    });

    statistics.adminAccounts.active = await Accounts.countDocuments({
        status: 'active',
        deleted: false
    });

    statistics.adminAccounts.inactive = await Accounts.countDocuments({
        status: 'inactive',
        deleted: false
    });

    // Users - client
    statistics.clientAccounts.total = await Users.countDocuments({
        deleted: false
    });

    statistics.clientAccounts.active = await Users.countDocuments({
        status: 'active',
        deleted: false
    });

    statistics.clientAccounts.inactive = await Users.countDocuments({
        status: 'inactive',
        deleted: false
    });


    res.render("admin/pages/dashboard/dashboard.pug", {
        pageTitle: 'Trang tổng quan',
        statistics: statistics
    })
}