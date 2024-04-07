const Users = require('../../models/user.model')
const Cart = require('../../models/cart.model')

const ForgotPassword = require('../../models/forgot-password.model')

const md5 = require("md5");

const generateHelper = require('../../helpers/generate');
const {
    response
} = require('express');
// const sendMailHelper = require('../../helpers/sendMail');

// [GET] /user/register
module.exports.register = async (req, res) => {
    try {
        res.render("client/pages/user/register", {
            pageTitle: 'Đăng ký tài khoản'
        })

    } catch (error) {
        console.log('Error occurred:', error);
        req.flash('error', 'Page is not exists, redirected to previous page');
        res.redirect("back");
    }
}

// [GET] /user/login
module.exports.login = async (req, res) => {
    try {
        res.render("client/pages/user/login", {
            pageTitle: 'Đăng nhập'
        })

    } catch (error) {
        console.log('Error occurred:', error);
        req.flash('error', 'Page is not exists, redirected to previous page');
        res.redirect("back");
    }
}

// [GET] /user/logout
module.exports.logout = async (req, res) => {
    res.clearCookie('tokenUser');
    //   await Users.updateOne({
    //     _id: res.locals.user.id
    //   }, {
    //     onlineStatus: 'offline'
    //   })

    //   _io.once('connection', (socket) => {
    //     socket.broadcast.emit('SERVER_RETURN_USER_OFFLINE', res.locals.user.id);
    //   })

    req.flash('success', 'Tài khoản đã được đăng xuất!')
    res.redirect('/')
}

// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
    try {
        res.render('client/pages/user/forgot-password', {
            pageTitle: "Lấy lại mật khẩu"
        })

    } catch (error) {
        console.log('Error occurred:', error);
        req.flash('error', 'Page is not exists, redirected to previous page');
        res.redirect("back");
    }
}

// [GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
    try {
        const email = req.query.email;

        res.render('client/pages/user/otp-password', {
            pageTitle: "Nhập mã OTP",
            email: email
        })

    } catch (error) {
        console.log('Error occurred:', error);
        req.flash('error', 'Page is not exists, redirected to previous page');
        res.redirect("back");
    }
}

// // [GET] /user/password/reset
// module.exports.resetPassword = async (req, res) => {
//   try {
//     res.render('client/pages/user/reset-password', {
//       pageTitle: "Reset Password"
//     })

//   } catch (error) {
//     console.log('Error occurred:', error);
//     req.flash('error', 'Page is not exists, redirected to previous page');
//     res.redirect("back");
//   }
// }

// [GET] /user/info
module.exports.userInfo = async (req, res) => {
    try {
        res.render('client/pages/user/info', {
            pageTitle: "Thông tin cá nhân"
        })

    } catch (error) {
        console.log('Error occurred:', error);
        req.flash('error', 'Page is not exists, redirected to previous page');
        res.redirect("back");
    }
}

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
    try {
        const emailExisted = await Users.findOne({
            email: req.body.email,
            deleted: false
        })

        if (emailExisted) {
            req.flash('error', 'Email đã tồn tại, vui lòng nhập email khác');
            res.redirect("back");
            return;
        }

        req.body.password = md5(req.body.password);

        const newUser = new Users(req.body);
        await newUser.save();

        console.log(newUser);
        req.flash('success', "Tạo tài khoản thành công!");
        res.cookie('tokenUser', newUser.tokenUser);
        res.redirect('/');

    } catch (error) {
        console.log('Error occurred:', error);
        req.flash('error', 'Page is not exists, redirected to previous page');
        res.redirect("back");
    }
}

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
    try {
        const email = req.body.email
        const password = md5(req.body.password)

        const user = await Users.findOne({
            email: email,
            deleted: false
        })

        if (!user) {
            req.flash('error', 'Email hoặc mật khẩu không đúng! vui lòng nhập lại.');
            res.redirect("back");
            return;
        }

        if (password !== user.password) {
            req.flash('error', 'Email hoặc mật khẩu không đúng! vui lòng nhập lại.');
            res.redirect("back");
            return;
        }

        if (user.status === 'inactive') {
            req.flash('error', 'Tài khoản đã bị khóa');
            res.redirect("back");
            return;
        }

        // Save user_id to Cart collection
        await Cart.updateOne({
            _id: req.cookies.cartId
        }, {
            user_id: user.id
        })

        // // Update online status
        // await Users.updateOne({
        //   _id: user.id
        // }, {
        //   onlineStatus: 'online'
        // })

        // _io.once('connection', (socket) => {
        //   socket.broadcast.emit('SERVER_RETURN_USER_ONLINE', user.id
        //   )
        // })

        res.cookie('tokenUser', user.tokenUser);
        req.flash('success', 'Đăng nhập thành công!')
        res.redirect('/')

    } catch (error) {
        console.log('Error occurred:', error);
        req.flash('error', 'Page is not exists, redirected to previous page');
        res.redirect("back");
    }
}

// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    try {
        const email = req.body.email;

        const emailExisted = await Users.findOne({
            email: email,
            deleted: false
        })

        if (!emailExisted) {
            req.flash('error', 'Email is not existed. Please try again');
            res.redirect('back');
            return;
        }

        // Tạo mã OTP và lưu OTP, email vào collection forgot password
        const otp = generateHelper.generateRandomNumber(6);

        const forgotPasswordObj = {
            email: email,
            otp: otp,
            expireAt: Date.now()
        }

        const forgotPassword = new ForgotPassword(forgotPasswordObj);
        await forgotPassword.save();

        // // Send OTP code to gmail of user
        // const subject = 'OTP verification code for retriving password'
        // const content = `
        //   <p>Your OTP verification code is <b>${otp}</b></p>
        //   <p>OTP code expires in 2 minutes, do not share the code.</p>
        // `

        // sendMailHelper.sendMail(email, subject, content);

        res.redirect(`/user/password/otp?email=${email}`)
    } catch (error) {
        console.log('Error occurred:', error);
        req.flash('error', 'Error occured, redirected to previous page');
        res.redirect("back");
    }
}

// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
    try {
        const email = req.body.email;
        const otp = req.body.otp;

        const result = await ForgotPassword.findOne({
            email: email,
            otp: otp
        })

        if (!result) {
            req.flash('error', 'OTP Không hợp lệ!');
            res.redirect("back");
            return;
        }

        const user = await Users.findOne({
            email: email
        })

        res.cookie("tokenUser", user.tokenUser);
        res.redirect("/user/password/reset")

    } catch (error) {
        console.log('Error occurred:', error);
        req.flash('error', 'Error occurred, redirected to previous page');
        res.redirect("back");
    }
}

// // [POST] /user/password/reset
// module.exports.resetPasswordPost = async (req, res) => {
//   try {
//     const tokenUser = req.cookies.tokenUser;

//     await Users.updateOne({
//       tokenUser: tokenUser
//     }, {
//       password: md5(req.body.password)
//     })

//     req.flash('Password changed successfully, welcome to home page !')
//     res.redirect('/');

//   } catch (error) {
//     console.log('Error occurred:', error);
//     req.flash('error', 'Error occurred, redirected to previous page');
//     res.redirect("back");
//   }
// }