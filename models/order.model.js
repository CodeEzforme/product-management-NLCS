const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  // user_id: String
  cart_id: String,
  status: {
    type: String,
    default: "inactive",
  },
  userInfo: {
    fullName: String,
    address: String,
    phone: String
  },
  products: [{
    product_id: String,
    quantity: Number,
    price: Number,
    discountPercentage: Number
  }],
  updatedBy: [{
    account_id: String,
    deletedAt: Date
  }],
}, {
  timestamps: true
})

const Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order;