const mongoose = require('mongoose')
const generate = require('../helpers/generate');
const systemConfig = require(".././config/system");

const usersSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  tokenUser: {
    type: String,
    default: generate.generateRandomString(30)
  },
  phone: String,
  avatar: String,
  friendList: [{
    user_id: String,
    room_chat_id: String,
  }],
  acceptFriends: Array,
  requestFriends: Array,
  onlineStatus: String,
  status: {
    type: String,
    default: 'active'
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
}, {
  timestamps: true,
  strict: true
})

const Users = mongoose.model("Users", usersSchema, 'users');

module.exports = Users;