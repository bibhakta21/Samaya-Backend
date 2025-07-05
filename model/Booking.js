const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, default: 1 },
  productImage: { type: String, default: "" },
  productShortName: { type: String, required: true },
  price: { type: Number, required: true },
  addressOne: { type: String, default: null },
  country: { type: String, default: null },
  dialColor: { type: String, default: null },
  bandColor: { type: String, default: null },
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model("Booking", BookingSchema);
