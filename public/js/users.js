// Supporting functions
const refuseFriend = (btn) => {
    btn.addEventListener('click', () => {
        btn.closest('.box-user').classList.add('refuse');
        const userId = btn.getAttribute('btn-refuse-friend');
        socket.emit('CLIENT_REFUSE_FRIEND', userId);
    })
}

const addFriend = (btn) => {
    btn.addEventListener('click', () => {
        btn.closest('.box-user').classList.add('add');
        const userId = btn.getAttribute('btn-add-friend');
        socket.emit('CLIENT_ADD_FRIEND', userId);
    })
}

const acceptFriend = (btn) => {
    btn.addEventListener('click', () => {
        btn.closest('.box-user').classList.add('accepted');
        const userId = btn.getAttribute('btn-accept-friend');
        socket.emit('CLIENT_ACCEPT_FRIEND', userId);
    })
}

// const acceptFriend = (btn) => {
//     btn.addEventListener('click', () => {
//         btn.closest('.box-user').classList.add('accepted');
//         const userId = btn.getAttribute('btn-accept-friend');
//         socket.emit('CLIENT_ACCEPT_FRIEND', userId);
//     })
// }

// display online status badget real time (friends list page)
const onlineBadgeDisplay = (onlineStatus, userId) => {
    const dataUsersFriend = document.querySelector('[data-users-friend]');
    if (dataUsersFriend) {
        const userBox = dataUsersFriend.querySelector(`.col-6[user-id="${userId}"]`);
        if (userBox) {
            userBox.querySelector("[status]").setAttribute("status", onlineStatus);
        }
    }
}


/* Handle event add friend */
const listAddFriendBtn = document.querySelectorAll('[btn-add-friend]');
if (listAddFriendBtn.length > 0) {
    listAddFriendBtn.forEach(btn => {
        addFriend(btn);
    });
}
/* End handle event add friend */

/* Handle event cancel friend request */
const listCancelFriendBtn = document.querySelectorAll('[btn-cancel-friend]');
if (listCancelFriendBtn.length > 0) {
    listCancelFriendBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.box-user').classList.remove('add');

            const userId = btn.getAttribute('btn-cancel-friend');
            socket.emit('CLIENT_CANCEL_FRIEND', userId);
        })
    })
}
/* End handle event cancel friend request */

/* Handle event refuse friend request */
const listRefuseFriendBtn = document.querySelectorAll('[btn-refuse-friend]');
if (listRefuseFriendBtn.length > 0) {
    listRefuseFriendBtn.forEach(btn => {
        refuseFriend(btn);
    })
}
/* End handle event refuse friend request */

/* Handle event accept friend request */
const listAcceptFriendBtn = document.querySelectorAll('[btn-accept-friend]');
if (listAcceptFriendBtn.length > 0) {
    listAcceptFriendBtn.forEach(btn => {
        acceptFriend(btn);
    })
}
/* End handle event accept friend request */

/* Get length of acceptFriend field */
socket.on('SERVER_RETURN_ACCEPT_FRIEND_LENGTH', (data) => {
    const userBadgeAccept = document.querySelector('[badge-users-accept]');
    const userId = userBadgeAccept.getAttribute('badge-users-accept');

    if (userId == data.userId) {
        userBadgeAccept.innerHTML = data.acceptFriendsLength;
    }
})

// SERVER_RETURN_INFO_ACCEPT_FRIEND
socket.on('SERVER_RETURN_INFO_ACCEPT_FRIEND', (data) => {
    // display users information - friend request page

    const dataUsersAccept = document.querySelector('[data-users-accept]');
    if (dataUsersAccept) {
        const userId = dataUsersAccept.getAttribute("data-users-accept");
        if (userId == data.userId) {
            const userBox = document.createElement('div');
            userBox.classList.add('col-6');
            userBox.setAttribute("user-id", data.currentUserInfo._id);

            userBox.innerHTML = `
          <div class="box-user">
            <div class="inner-avatar">
              <img
                src="${data.currentUserInfo.avatar ? data.currentUserInfo.avatar : '/images/img_avatar.png'}" 
                alt="${data.currentUserInfo.fullName}"
              >
            </div>
            <div class="inner-info">
              <div class="inner-name">
                ${data.currentUserInfo.fullName}
              </div>
              <div class="inner-buttons">
                <button class="btn btn-sm btn-primary mr-1" btn-accept-friend=${data.currentUserInfo._id}>
                  Chấp nhận
                </button>
                <button class="btn btn-sm btn-secondary mr-1" btn-refuse-friend=${data.currentUserInfo._id}>
                  Xóa
                </button>
                <button class="btn btn-sm btn-secondary mr-1" btn-deleted-friend="" disabled="">
                  Đã xóa
                </button>
                <button class="btn btn-sm btn-secondary mr-1" btn-accepted-friend="" disabled="">
                  Đã chấp nhận
                </button>
              </div>
            </div>
          </div>
        `;

            dataUsersAccept.appendChild(userBox);

            // add event for new elements
            const refuseFriendBtn = userBox.querySelector('[btn-refuse-friend]');
            refuseFriend(refuseFriendBtn);

            const acceptFriendBtn = userBox.querySelector('[btn-accept-friend]');
            acceptFriend(acceptFriendBtn);
        }
    }

    // User list page
    const dataUsersNotFriend = document.querySelector('[data-users-not-friend]');
    if (dataUsersNotFriend) {
        const userId = dataUsersNotFriend.getAttribute("data-users-not-friend");
        if (userId == data.userId) {
            const userBoxRemove = dataUsersNotFriend.querySelector(`[user-id="${data.currentUserInfo._id}"]`);
            if (userBoxRemove) {
                dataUsersNotFriend.removeChild(userBoxRemove);
            }
        }
    }

})
// END SERVER_RETURN_INFO_ACCEPT_FRIEND

// SERVER_RETURN_USER_ID_CANCEL_FRIEND
socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIEND", (data) => {
    const dataUsersAccept = document.querySelector('[data-users-accept]');
    const userId = dataUsersAccept.getAttribute("data-users-accept");

    if (userId == data.otherUserId) {
        const userBoxRemove = dataUsersAccept.querySelector(`[user-id="${data.currentUserId}"]`);
        if (userBoxRemove) {
            dataUsersAccept.removeChild(userBoxRemove);
        }
    }
})
// END SERVER_RETURN_USER_ID_CANCEL_FRIEND


// SERVER_RETURN_USER_ONLINE
socket.on('SERVER_RETURN_USER_ONLINE', (userId) => {
    onlineBadgeDisplay('online', userId);
});

// END SERVER_RETURN_USER_ONLINE
socket.on('SERVER_RETURN_USER_OFFLINE', (userId) => {
    onlineBadgeDisplay('offline', userId)
});