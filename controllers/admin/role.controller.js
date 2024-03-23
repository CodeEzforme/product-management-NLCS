const Role = require("../../models/role.model");

// Hỗ trợ route [GET] /admin/roles
module.exports.index = async (req, res) => {
    const records = await Role.find({
        deleted: false
    });

    res.render("admin/pages/roles/index", {
        pageTitle: "Danh sách nhóm quyền",
        records: records
    });
}