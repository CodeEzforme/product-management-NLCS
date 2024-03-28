const md5 = require('md5');

const Account = require('../../models/account.model');
const Role = require('../../models/role.model');

const systemConfig = require('../../config/system');

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    const records = await Account.find({
        deleted: false,
    });

    for (const record of records) {
        const role = await Role.findOne({ _id: record.role_id });
        record.role = role;
    }

    res.render("admin/pages/accounts/index", {
        pageTitle: "Danh sách tài khoản",
        records: records
    })
}

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    const roles = await Role.find({
        deleted: false
    });

    res.render("admin/pages/accounts/create", {
        pageTitle: "Tạo mới tài khoản",
        roles: roles
    });
}

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
    try {
        req.body.password = md5(req.body.password);

        const emailExisted = await Account.findOne({
          email: req.body.email,
          deleted: false
        })

        // if (emailExisted) {
        //   req.flash('error', 'Email existed, please choose another email');
        //   res.redirect("back");
        //   return;
        // }

        const newAccount = new Account(req.body)
        await newAccount.save();

        req.flash('success', 'Tạo tài khoản thành công !');
        res.redirect(`/${systemConfig.prefixAdmin}/accounts`);

      } catch (error) {
        console.log('ERROR OCCURED:', error);
        req.flash('error', "Error occured, can not create account");
        res.redirect('back');
      }
};

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    try {
      const id = req.params.id;
      const data = await Account.findOne({
        _id: id,
        deleted: false
      });

      const roles = await Role.find({
        deleted: false
      });

      res.render("admin/pages/accounts/edit.pug", {
        pageTitle: "Chỉnh sửa tài khoản",
        data: data,
        roles: roles
      })

    } catch (error) {
      console.log('ERROR OCCURED:', error);
      req.flash('error', "Error occured, page did not existed");
      res.redirect('back');
    }
  }

  // [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        if(req.body.password) {
            req.body.password = md5(req.body.password);
        } else {
            delete req.body.password;
        }

        // if (req.file && req.file.filename) {
        //     req.body.thumbnail = `/uploads/${req.file.filename}`
        // }

        await Account.updateOne({ _id: req.params.id }, req.body);

        req.flash('success', 'Cập nhật tài khoản thành công !');
        res.redirect('back');

        } catch (error) {
        console.log('ERROR OCCURED:', error);
        req.flash('error', "Error occured, can not update account");
        res.redirect('back');
    }
}
