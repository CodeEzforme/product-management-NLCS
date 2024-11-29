const Users = require('../../models/user.model')
const Cart = require('../../models/cart.model')
const ChatRoom = require('../../models/room-chat.model');

const ForgotPassword = require('../../models/forgot-password.model')

const md5 = require("md5");

const generateHelper = require('../../helpers/generate');

const {
    response
} = require("express");

const sendMailHelper = require('../../helpers/sendMail');

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
    await Users.updateOne({
        _id: res.locals.user.id
    }, {
        onlineStatus: 'offline'
    })

    _io.once('connection', (socket) => {
        socket.broadcast.emit('SERVER_RETURN_USER_OFFLINE', res.locals.user.id);
    })

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

// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
    try {
        res.render('client/pages/user/reset-password', {
            pageTitle: "Reset Password"
        })

    } catch (error) {
        console.log('Error occurred:', error);
        req.flash('error', 'Page is not exists, redirected to previous page');
        res.redirect("back");
    }
}

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

// [GET] /user/edit
module.exports.edit = async (req, res) => {
    try {
        res.render("client/pages/user/edit", {
            pageTitle: 'Chỉnh sửa thông tin cá nhân'
        });
    } catch (error) {
        console.log("ERROR OCCURRED:", error);
        req.flash("error", "Error occured, page is not exists");
        res.redirect('back');
    }
}

// [PATCH] /admin/user/edit////// lỗi req.body.password đã bị ẩn ròi do đụng độ các middllewe hoặc 
module.exports.editPatch = async (req, res) => {
    try {
        if (req.body.password) {
            req.body.password = md5(req.body.password);
        } else {
            delete req.body.password;
        }

        const tokenUser = req.cookies.tokenUser;
        await Users.updateOne({
            tokenUser: tokenUser
        }, {
            password: req.body.password
        })

        // await Users.updateOne({
        //     _id: res.locals.user.id,
        //     password: req.body.password
        // }, req.body)

        req.flash("success", "Thông tin tài khoản đã được cập nhật thành công!");
        res.redirect('back')

    } catch (error) {
        console.log("ERROR OCCURRED:", error);
        req.flash("error", "Error occured, can not update account information");
        res.redirect('back');
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
        ///// kết bạn với Shop chả lụa Tùng Loan///////////////////////////////////
        const currentUserId = newUser._id;
        const otherUserId = '6744179aa20cbe4e88a69bf4'
        // const currentUserExisted = await Users.findOne({
        //     _id: currentUserId,
        //     acceptFriends: otherUserId
        // })

        // const otherUserExisted = await Users.findOne({
        //     _id: otherUserId,
        //     requestFriends: currentUserId
        // })

        // // create chat room
        let chatRoom;

        // if (currentUserExisted && otherUserExisted) {
        chatRoom = new ChatRoom({
            roomType: 'friend',
            users: [{
                    user_id: currentUserId,
                    role: 'superAdmin'
                },
                {
                    user_id: otherUserId,
                    role: 'superAdmin'
                }
            ]
        });

        await chatRoom.save();
        // }


        // if (currentUserExisted) {
        await Users.updateOne({
            _id: currentUserId
        }, {
            $push: {
                friendList: {
                    user_id: otherUserId,
                    room_chat_id: chatRoom.id
                }
            },
            // $pull: {
            //     acceptFriends: otherUserId
            // }
        })
        // }

        // // Add {user_id, room_chat_id } of CURRENT USER to friendList of OTHER USER
        // // Remove id of CURRENT USER in acceptFriends field of OTHER USER

        // if (otherUserExisted) {
        await Users.updateOne({
            _id: otherUserId
        }, {
            $push: {
                friendList: {
                    user_id: currentUserId,
                    room_chat_id: chatRoom.id
                }
            },
            // $pull: {
            //     acceptFriends: currentUserId
            // }
        })
        // }
        ///// Hết kết bạn với Shop chả lụa Tùng Loan///////////////////////////

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

        // Update online status
        await Users.updateOne({
            _id: user.id
        }, {
            onlineStatus: 'online'
        })

        _io.once('connection', (socket) => {
            socket.broadcast.emit('SERVER_RETURN_USER_ONLINE', user.id)
        })

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
            req.flash('error', 'Email chưa được đăng ký! vui lòng nhập lại!');
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

        // Gửi OTP đến email người dùng
        const subject = 'Mã OTP xác minh lấy lại mật khẩu'
        const content = `
          <p> Mã OTP xác minh lấy lại mật khẩu là <b>${otp}</b></p>
          <p> OTP có thời gian sử dụng 3 phút! Lưu ý không được để lộ mã OTP.</p>
        `

        sendMailHelper.sendMail(email, subject, content);

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

// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
    try {
        const tokenUser = req.cookies.tokenUser;

        await Users.updateOne({
            tokenUser: tokenUser
        }, {
            password: md5(req.body.password)
        })

        req.flash("success", 'Thay đổi mật khẩu thành công!')
        res.redirect('/');

    } catch (error) {
        console.log('Error occurred:', error);
        req.flash('error', 'Error occurred, redirected to previous page');
        res.redirect("back");
    }
}