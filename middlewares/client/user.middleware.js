const Users = require('../../models/user.model')

module.exports.userInfo = async (req, res, next) => {
    if (req.cookies.tokenUser) {
        const user = await Users.findOne({
            tokenUser: req.cookies.tokenUser,
            deleted: false
        }).select("-password");

        if (user) {
            res.locals.user = user;
            //   res.locals.user.id = user._id; // Addon, recheck 
        }
    }
    next();
}