const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    deleted: Boolean,
    deletedAt: Date,
    updatedAt: Date,
  });

const Product = mongoose.model("Product", personSchema, "products");

module.exports = Product;