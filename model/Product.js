const mongoose = require("mongoose");

const ImageCombinationSchema = new mongoose.Schema({
  dialColor: { type: String, required: true },
  bandColor: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

const ProductSchema = new mongoose.Schema({
  shortName: { type: String, required: true },
  fullName: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number }, // New field for discount
  rating: { type: Number, default: 0 },
  reviews: [{ type: String }],
  description: { type: String, required: true },
  type: { type: String, enum: ["digital", "analog"], required: true },
  inStock: { type: Boolean, default: true },
  imageCombinations: [ImageCombinationSchema], // New logic here
});

module.exports = mongoose.model("Product", ProductSchema);
