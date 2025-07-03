const mongoose = require("mongoose");

// Schema for image combinations (e.g., dialColor + bandColor)
const ImageCombinationSchema = new mongoose.Schema({
  dialColor: { type: String, required: true },
  bandColor: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

// Schema for product reviews
const ReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String }, // Can be helpful for quick display
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const ProductSchema = new mongoose.Schema({
  shortName: { type: String, required: true },
  fullName: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  rating: { type: Number, default: 5 }, // overall average rating
  reviews: [ReviewSchema],
  description: { type: String, required: true },
  type: { type: String, enum: ["digital", "analog"], required: true },
  inStock: { type: Boolean, default: true },
  imageCombinations: [ImageCombinationSchema],
});

module.exports = mongoose.model("Product", ProductSchema);
