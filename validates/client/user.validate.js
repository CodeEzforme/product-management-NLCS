function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

module.exports.registerPost = async (req, res, next) => {
    if (!req.body.fullName) {
        req.flash('error', "Tên không được để trống");
        res.redirect('back');
        return;
    }

    if (req.body.fullName.length < 5) {
        req.flash('error', "Họ tên phải ít nhất 5 ký tụ");
        res.redirect('back');
        return;
    }

    if (!req.body.email) {
        req.flash('error', "Email không được để trống");
        res.redirect('back');
        return;
    }

    if (!isValidEmail(req.body.email)) {
        req.flash('error', "Giá trị email chưa đúng định dạng");
        res.redirect('back');
        return;
    }

    if (req.body.password.length < 6) {
        req.flash('error', "Mật khẩu tối thiểu 6 kí tự");
        res.redirect('back');
        return;
    }

    next();
};


  module.exports.loginPost = async (req, res, next) => {
    if (!req.body.email) {
      req.flash('error', "Email không được rỗng!");
      res.redirect('back');
      return;
    }

    if (!isValidEmail(req.body.email)) {
      req.flash('error', "email không đúng định dạng");
      res.redirect('back');
      return;
    }

    next();
  };

  module.exports.forgotPasswordPost = async (req, res, next) => {
    if (!req.body.email) {
      req.flash('error', "Email không được để trống!");
      res.redirect('back');
      return;
    }

    if (!isValidEmail(req.body.email)) {
      req.flash('error', "Email không đúng định dạng!");
      res.redirect('back');
      return;
    }

    next();
  };

  module.exports.resetPasswordPost = async (req, res, next) => {
    if (!req.body.password) {
      req.flash('error', "Mật khẩu không được để trống");
      res.redirect('back');
      return;
    }

    if (!req.body.confirmPassword) {
      req.flash('error', "Vui lòng nhập lại mật khẩu!");
      res.redirect('back');
      return;
    }

    if (req.body.confirmPassword != req.body.password) {
      req.flash('error', "Xác nhận mật khẩu không trùng khớp!");
      res.redirect('back');
      return;
    }

    next();
  };