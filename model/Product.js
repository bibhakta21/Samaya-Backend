const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  shortName: { type: String, required: true },
  fullName: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  reviews: [{ type: String }], 
  description: { type: String, required: true },
  dialColor: { type: String, required: true },
  bandColor: { type: String, required: true },
  type: { type: String, enum: ["digital", "analog"], required: true },
  inStock: { type: Boolean, default: true },
  images: [{ type: String, required: true }],
});

module.exports = mongoose.model("Product", ProductSchema);
