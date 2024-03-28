const Role = require("../../models/role.model");

const systemConfig = require("../../config/system");

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

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/roles/create", {
        pageTitle: "Tạo mới nhóm quyền",
    });
}

// [POST] /admin/roles/createPost
module.exports.createPost = async (req, res) => {
    const record = new Role(req.body);
    await record.save();

    req.flash("success","Thêm nhóm quyền thành công");

    res.redirect(`/${systemConfig.prefixAdmin}/roles`);
}

// [GET] /admin/detail/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id;
    const data = await Role.findOne({ _id: id });

    res.render("admin/pages/roles/detail.pug", {
      pageTitle: "Detail Role",
      data: data
    })
}

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        const data = await Role.findOne({
            _id: id,
            deleted: false
        });

        res.render("admin/pages/roles/edit", {
            pageTitle: "Chỉnh sửa nhóm quyền",
            data: data
        });
    } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/roles`);
    }
}

// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    await Role.updateOne({ _id: id }, req.body);

    req.flash("success", "Cập nhật nhóm quyền thành công!");

    res.redirect("back");
};

// [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
    const records = await Role.find({
        deleted: false
    });

    res.render("admin/pages/roles/permissions", {
        pageTitle: "Phân quyền",
        records: records
    });
}

// [PATCH] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
    const permissions = JSON.parse(req.body.permissions);

    for (const item of permissions) {
        await Role.updateOne(
            {
                _id: item.id
            },
            {
                permissions: item.permissions
            }
        );
    }

    req.flash("success", "Cập nhật phân quyền thành công!");
    res.redirect("back");
};

// [DELETE] /admin/roles/delete/:id
module.exports.deleteItem = async (req, res) => {
    try {
      const id = req.params.id;
    console.log("ok");
      await Role.updateOne({ _id: id }, {
        deleted: true,
        deletedAt: Date()
      });

      req.flash('success', 'Xóa nhóm quyền thành công!');
      res.redirect('back');

    } catch (error) {
      console.log('ERROR OCCURED WHILE DELETING ROLE:', error);
      req.flash('error', 'Error occured, can not delete role');
      res.redirect('back');
    }
  }