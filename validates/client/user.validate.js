// function isValidEmail(email) {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
// }

// module.exports.registerPost = async (req, res, next) => {
//     if (!req.body.fullName) {
//         req.flash('error', "Tên không được để trống");
//         res.redirect('back');
//         return;
//     }

//     if (req.body.fullName.length < 5) {
//         req.flash('error', "Họ tên phải ít nhất 5 ký tụ");
//         res.redirect('back');
//         return;
//     }

//     if (!req.body.email) {
//         req.flash('error', "Email không được để trống");
//         res.redirect('back');
//         return;
//     }

//     if (!isValidEmail(req.body.email)) {
//         req.flash('error', "Giá trị email chưa đúng định dạng");
//         res.redirect('back');
//         return;
//     }

//     if (req.body.password.length < 6) {
//         req.flash('error', "Mật khẩu tối thiểu 6 kí tự");
//         res.redirect('back');
//         return;
//     }

//     next();
// };


//   module.exports.loginPost = async (req, res, next) => {
//     if (!req.body.email) {
//       req.flash('error', "Email không được rỗng!");
//       res.redirect('back');
//       return;
//     }

//     if (!isValidEmail(req.body.email)) {
//       req.flash('error', "email không đúng định dạng");
//       res.redirect('back');
//       return;
//     }

//     next();
//   };

//   module.exports.forgotPasswordPost = async (req, res, next) => {
//     if (!req.body.email) {
//       req.flash('error', "Email không được để trống!");
//       res.redirect('back');
//       return;
//     }

//     if (!isValidEmail(req.body.email)) {
//       req.flash('error', "Email không đúng định dạng!");
//       res.redirect('back');
//       return;
//     }

//     next();
//   };

//   module.exports.resetPasswordPost = async (req, res, next) => {
//     if (!req.body.password) {
//       req.flash('error', "Mật khẩu không được để trống");
//       res.redirect('back');
//       return;
//     }

//     if (!req.body.confirmPassword) {
//       req.flash('error', "Vui lòng nhập lại mật khẩu!");
//       res.redirect('back');
//       return;
//     }

//     if (req.body.confirmPassword != req.body.password) {
//       req.flash('error', "Xác nhận mật khẩu không trùng khớp!");
//       res.redirect('back');
//       return;
//     }

//     next();
//   };

// #############################################sử dụng thư viện express-validator
const { check, validationResult } = require('express-validator');

module.exports.registerPost = [
  // Validate fullName: không rỗng và tối thiểu 5 ký tự
  check('fullName')
    .notEmpty().withMessage('Tên không được để trống')
    .isLength({ min: 5 }).withMessage('Họ tên phải ít nhất 5 ký tự'),

  // Validate email: không rỗng và phải đúng định dạng email
  check('email')
    .notEmpty().withMessage('Email không được để trống')
    .isEmail().withMessage('Giá trị email chưa đúng định dạng'),

  // Validate password: không rỗng và tối thiểu 6 ký tự
  check('password')
    .notEmpty().withMessage('Mật khẩu không được để trống')
    .isLength({ min: 6 }).withMessage('Mật khẩu tối thiểu 6 ký tự'),

  // Xử lý lỗi sau khi validate
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg);
      return res.redirect('back');
    }
    next();
  }
];

module.exports.loginPost = [
  // Validate email: không rỗng và đúng định dạng
  check('email')
    .notEmpty().withMessage('Email không được rỗng!')
    .isEmail().withMessage('Email không đúng định dạng'),

  // Xử lý lỗi sau khi validate
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg);
      return res.redirect('back');
    }
    next();
  }
];

module.exports.forgotPasswordPost = [
  // Validate email: không rỗng và đúng định dạng
  check('email')
    .notEmpty().withMessage('Email không được để trống!')
    .isEmail().withMessage('Email không đúng định dạng!'),

  // Xử lý lỗi sau khi validate
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg);
      return res.redirect('back');
    }
    next();
  }
];

module.exports.resetPasswordPost = [
  // Validate password: không rỗng và tối thiểu 6 ký tự
  check('password')
    .notEmpty().withMessage('Mật khẩu không được để trống')
    .isLength({ min: 6 }).withMessage('Mật khẩu tối thiểu 6 ký tự'),

  // Validate confirmPassword: không rỗng và phải trùng khớp với password
  check('confirmPassword')
    .notEmpty().withMessage('Vui lòng nhập lại mật khẩu!')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Xác nhận mật khẩu không trùng khớp!');
      }
      return true;
    }),

  // Xử lý lỗi sau khi validate
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg);
      return res.redirect(req.get("Referrer") || "/");
    }
    next();
  }
];
