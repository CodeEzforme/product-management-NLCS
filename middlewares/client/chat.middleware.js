const ChatRooms = require('../../models/room-chat.model');

module.exports.allowAccess = async (req, res, next) => {
  try {
    if (!res.locals.user) {
      req.flash('error', 'Please login before using this feature');
      res.redirect(`/user/login`);
    }

    const allowAccessed = await ChatRooms.findOne({
      _id: req.params.chatRoomId,
      'users.user_id': res.locals.user.id,
      deleted: false
    })

    if (allowAccessed) {
      next();
    } else {
      res.redirect('/');
    }
  } catch (error) {
    req.flash('error', 'Page is not exists, redirect to home page')
    res.redirect('/');
  }
}