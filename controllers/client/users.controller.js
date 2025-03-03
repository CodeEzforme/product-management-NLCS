const Users = require('../../models/user.model')

const usersSocket = require('../../sockets/client/users.socket.js');

// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
  try {
    const currentUserId = res.locals.user.id;

    usersSocket(req, res); // SockerIO

    const currentUser = await Users.findOne({
      _id: currentUserId
    })
    const friendList = currentUser.friendList;
    const acceptFriendList = currentUser.acceptFriends;
    const requestFriendList = currentUser.requestFriends;

    // Lấy danh sách user_id từ friendList
    const friendUserIds = friendList.map(friend => friend.user_id);

    const users = await Users.find({
      $and: [{
          _id: {
            $ne: currentUserId
          }
        },
        {
          _id: {
            $nin: friendUserIds
          }
        },
        {
          _id: {
            $nin: acceptFriendList
          }
        },
        {
          _id: {
            $nin: requestFriendList
          }
        },
      ],
      status: 'active',
      deleted: false
    }).select('avatar fullName')

    res.render("client/pages/users/not-friend", {
      pageTitle: 'Danh sách người dùng',
      users: users
    })

  } catch (error) {
    console.log("ERROR OCCURRED:", error);
    req.flash('error', 'Page is not exists, directed to home page');
    res.redirect("back");
  }
}

// [GET] /users/request
module.exports.request = async (req, res) => {
  try {
    usersSocket(req, res); // SockerIO

    const currentUserId = res.locals.user.id;
    const currentUser = await Users.findOne({
      _id: currentUserId,
    })

    const friendRequestList = currentUser.requestFriends;

    const users = await Users.find({
      _id: {
        $in: friendRequestList
      },
      status: 'active',
      deleted: false
    })

    res.render('client/pages/users/request', {
      pageTitle: 'Lời mời đã gửi',
      users: users
    })

  } catch (error) {
    console.log("ERROR OCCURRED:", error);
    req.flash('error', 'Page is not exists, directed to home page');
    res.redirect("back");
  }
}

// [GET] /users/accept
module.exports.accept = async (req, res) => {
  try {
    usersSocket(req, res);

    const currentUserId = res.locals.user.id;
    const currentUser = await Users.findOne({
      _id: currentUserId,
    })

    const friendAcceptList = currentUser.acceptFriends;

    const users = await Users.find({
      _id: {
        $in: friendAcceptList
      },
      status: 'active',
      deleted: false
    })

    res.render('client/pages/users/accept', {
      pageTitle: 'Lời mời đã nhận',
      users: users
    })

  } catch (error) {
    console.log("ERROR OCCURRED:", error);
    req.flash('error', 'Page is not exists, directed to home page');
    res.redirect("back");
  }
}

// [GET] /users/friend
module.exports.friends = async (req, res) => {
  try {
    usersSocket(req, res);

    const currentUserId = res.locals.user.id;
    const currentUser = await Users.findOne({
      _id: currentUserId,
    })

    const friendList = currentUser.friendList;

    const friendListId = friendList.map(item => item.user_id)

    const users = await Users.find({
      _id: {
        $in: friendListId
      },
      status: 'active',
      deleted: false
    }).select('id fullName avatar onlineStatus');

    users.forEach(user => {
      const userInfo = friendList.find(friend => friend.user_id == user.id);
      user.chatRoomId = userInfo.room_chat_id;
    })

    res.render('client/pages/users/friends', {
      pageTitle: 'Danh sách bạn bè',
      users: users
    })

  } catch (error) {
    console.log("ERROR OCCURRED:", error);
    req.flash('error', 'Page is not exists, directed to home page');
    res.redirect("back");
  }
}