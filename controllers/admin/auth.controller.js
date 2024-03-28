const Account = require('../../models/account.model');
const md5 = require('md5');

const systemConfig = require('../../config/system');

// [GET] /admin/auth/login
module.exports.login = async (req, res) => {
  try {
    res.render("admin/pages/auth/login.pug", {
      pageTitle: "Đăng nhập"
    })

  } catch (error) {
    console.log('ERROR OCCURED:', error);
    req.flash('error', "Error occured, page did not existed");
    res.redirect('back');
  }
}

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
  try {
    const enteredEmail = req.body.email;
    const enteredPassword = md5(req.body.password);

    const user = await Account.findOne({
      email: enteredEmail
    })

    if (!user) {
      req.flash("error", "Tài khoản không tồn tại!");
      res.redirect("back");
      return;
    }

    if (enteredPassword != user.password) {
      req.flash("error", "Mật khẩu không đúng, vui lòng nhập lại!");
      res.redirect("back");
      return;
    }

    if (user.status == 'inactive') {
      req.flash("error", "Không thể đăng nhập, tài khoản đang bị khóa!");
      res.redirect("back");
      return;
    }

    res.cookie("token", user.token);
    req.flash("success", "Đăng nhập thành công!");
    res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);    

  } catch (error) {
    console.log("ERROR OCCURED: ", error);
    req.flash("error", "Error occured, can not login");
    res.redirect("back");
  }
}

// [GET] /admin/auth/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("token");
  res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
}