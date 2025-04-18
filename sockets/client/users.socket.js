const Users = require('../../models/user.model');
const ChatRoom = require('../../models/room-chat.model');

module.exports = async (req, res) => {
    try {
        const currentUserId = res.locals.user.id;

        _io.once('connection', (socket) => {
            // socket.on('DEFAULT_CLIENT_ADDED_FRIEND_ADMIN', async (otherUserId) => {
            //     console.log(otherUserId);
            //     otherUserId = '6744179aa20cbe4e88a69bf4'
            //     const currentUserExisted = await Users.findOne({
            //         _id: currentUserId,
            //         acceptFriends: otherUserId
            //     })

            //     const otherUserExisted = await Users.findOne({
            //         _id: otherUserId,
            //         requestFriends: currentUserId
            //     })

            //     // // create chat room
            //     let chatRoom;

            //     if (currentUserExisted && otherUserExisted) {
            //         chatRoom = new ChatRoom({
            //             roomType: 'friend',
            //             users: [{
            //                     user_id: currentUserId,
            //                     role: 'superAdmin'
            //                 },
            //                 {
            //                     user_id: otherUserId,
            //                     role: 'superAdmin'
            //                 }
            //             ]
            //         });

            //         await chatRoom.save();
            //     }


            //     if (currentUserExisted) {
            //         await Users.updateOne({
            //             _id: currentUserId
            //         }, {
            //             $push: {
            //                 friendList: {
            //                     user_id: otherUserId,
            //                     room_chat_id: chatRoom.id
            //                 }
            //             },
            //             $pull: {
            //                 acceptFriends: otherUserId
            //             }
            //         })
            //     }

            //     // // Add {user_id, room_chat_id } of CURRENT USER to friendList of OTHER USER
            //     // // Remove id of CURRENT USER in acceptFriends field of OTHER USER

            //     if (otherUserExisted) {
            //         await Users.updateOne({
            //             _id: otherUserId
            //         }, {
            //             $push: {
            //                 friendList: {
            //                     user_id: currentUserId,
            //                     room_chat_id: chatRoom.id
            //                 }
            //             },
            //             $pull: {
            //                 acceptFriends: currentUserId
            //             }
            //         })
            //     }
            // })

            socket.on('CLIENT_ADD_FRIEND', async (otherUserId) => {
                const friendExisted = await Users.findOne({
                    _id: otherUserId,
                    acceptFriends: currentUserId
                })

                if (!friendExisted) {
                    // Add acceptFriend data to other user
                    await Users.updateOne({
                        _id: otherUserId
                    }, {
                        $push: {
                            acceptFriends: currentUserId
                        }
                    })
                }

                const userExisted = await Users.findOne({
                    _id: otherUserId,
                    requestFriends: currentUserId
                })

                if (!userExisted) {
                    // Add requestFriend field to current user
                    await Users.updateOne({
                        _id: currentUserId
                    }, {
                        $push: {
                            requestFriends: otherUserId
                        }
                    })
                }

                // Get length of acceptFriends of other user and send to that user
                const otherUser = await Users.findOne({
                    _id: otherUserId
                })

                const acceptFriendsLength = otherUser.acceptFriends.length;

                socket.broadcast.emit('SERVER_RETURN_ACCEPT_FRIEND_LENGTH', {
                    userId: otherUserId,
                    acceptFriendsLength: acceptFriendsLength
                })

                // Send current user information to other user
                const currentUserInfo = await Users.findOne({
                    _id: currentUserId
                }).select('id avatar fullName');

                socket.broadcast.emit('SERVER_RETURN_INFO_ACCEPT_FRIEND', {
                    userId: otherUserId,
                    currentUserInfo: currentUserInfo
                })
            })

            socket.on('CLIENT_CANCEL_FRIEND', async (otherUserId) => {
                const friendExisted = await Users.findOne({
                    _id: otherUserId,
                    acceptFriends: currentUserId
                })

                if (friendExisted) {
                    // Remove acceptFriend feild to other user
                    await Users.updateOne({
                        _id: otherUserId
                    }, {
                        $pull: {
                            acceptFriends: currentUserId
                        }
                    });
                }

                const userExisted = await Users.findOne({
                    _id: currentUserId,
                    requestFriends: otherUserId
                })
                // Remove requestFriend field to current user
                if (userExisted) {
                    await Users.updateOne({
                        _id: currentUserId
                    }, {
                        $pull: {
                            requestFriends: otherUserId
                        }
                    })
                }

                // Get length of acceptFriends of other user and send to that user
                const otherUser = await Users.findOne({
                    _id: otherUserId
                })

                const acceptFriendsLength = otherUser.acceptFriends.length;

                socket.broadcast.emit('SERVER_RETURN_ACCEPT_FRIEND_LENGTH', {
                    userId: otherUserId,
                    acceptFriendsLength: acceptFriendsLength
                })

                // Server return current user id to other user for cancel displaying user account 
                socket.broadcast.emit('SERVER_RETURN_USER_ID_CANCEL_FRIEND', {
                    currentUserId: currentUserId,
                    otherUserId: otherUserId
                })
            })

            socket.on('CLIENT_REFUSE_FRIEND', async (otherUserId) => {
                const friendExisted = await Users.findOne({
                    _id: otherUserId,
                    requestFriends: currentUserId
                })

                if (friendExisted) {
                    // remove acceptFriend field of other user
                    await Users.updateOne({
                        _id: otherUserId
                    }, {
                        $pull: {
                            requestFriends: currentUserId
                        }
                    })
                }

                const userExisted = await Users.findOne({
                    _id: currentUserId,
                    acceptFriends: otherUserId
                })

                if (userExisted) {
                    // Add requestFriend feild to current user
                    await Users.updateOne({
                        _id: currentUserId
                    }, {
                        $pull: {
                            acceptFriends: otherUserId
                        }
                    })
                }
            })

            socket.on('CLIENT_ACCEPT_FRIEND', async (otherUserId) => {
                // Add {user_id, room_chat_id } of OTHER USER to friendList of CURRENT USER
                // Remove id of OTHER USER in acceptFriends field of CURRENT USER

                const currentUserExisted = await Users.findOne({
                    _id: currentUserId,
                    acceptFriends: otherUserId
                })

                const otherUserExisted = await Users.findOne({
                    _id: otherUserId,
                    requestFriends: currentUserId
                })

                // // create chat room
                let chatRoom;

                if (currentUserExisted && otherUserExisted) {
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
                }


                if (currentUserExisted) {
                    await Users.updateOne({
                        _id: currentUserId
                    }, {
                        $push: {
                            friendList: {
                                user_id: otherUserId,
                                room_chat_id: chatRoom.id
                            }
                        },
                        $pull: {
                            acceptFriends: otherUserId
                        }
                    })
                }



                // // Add {user_id, room_chat_id } of CURRENT USER to friendList of OTHER USER
                // // Remove id of CURRENT USER in acceptFriends field of OTHER USER

                if (otherUserExisted) {
                    await Users.updateOne({
                        _id: otherUserId
                    }, {
                        $push: {
                            friendList: {
                                user_id: currentUserId,
                                room_chat_id: chatRoom.id
                            }
                        },
                        $pull: {
                            requestFriends: currentUserId
                        }
                    })
                }
            })
        })

    } catch (error) {
        console.log('Error occurred in Users Socket:', error);
        req.flash('error', "Error occured, can not add friend")
    }
}