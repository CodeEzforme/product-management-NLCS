const Chat = require('../../models/chat.model');
const Users = require('../../models/user.model');

const chatSocket = require('../../sockets/client/chat.socket')

// [GET] /chat/:chatRoomId
module.exports.index = async (req, res) => {
  try {
    const chatRoomId = req.params.chatRoomId;

    // SocketIO
    chatSocket(req, res);

    const chats = await Chat.find({
      room_chat_id: chatRoomId,
      deleted: false
    });

    for (const chat of chats) {
      const userInfo = await Users.findOne({
        _id: chat.user_id
      }).select('fullName')

      chat.userInfo = userInfo;
    }

    res.render('client/pages/chat/index.pug', {
      pageTitle: 'Chat',
      chats: chats
    })

  } catch (error) {
    console.log('Error occurred:', error);
    req.flash('error', 'Page is not exists, redirected to previous page');
    res.redirect("back");
  }
}