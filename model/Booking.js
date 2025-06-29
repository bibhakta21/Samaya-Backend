const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  productImage: { type: String, required: true },
  productShortName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  addressOne: { type: String, required: true },
  country: { type: String, required: true },
  number: { type: String, required: true },
  paymentType: { type: String, enum: ["cashondelivery", "khalti"], required: true },
  status: { type: String, enum: ["pending", "approved", "cancelled"], default: "pending" },
  bookingDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", BookingSchema);
