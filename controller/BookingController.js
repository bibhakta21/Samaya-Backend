const Booking = require("../model/Booking");
const Product = require("../model/Product");

// Create new order
exports.createBooking = async (req, res) => {
  try {
    const {
      productId,
      quantity,
      addressOne,
      country,
      number,
      paymentType
    } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const booking = new Booking({
      user: req.user.id,
      product: productId,
      productImage: product.images[0],
      productShortName: product.shortName,
      price: product.price,
      quantity,
      addressOne,
      country,
      number,
      paymentType
    });

    await booking.save();
    res.status(201).json({ message: "Order placed successfully!", booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all bookings for current user
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("product user", "shortName email");
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (req.user.id !== booking.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user", "username email");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancel order
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (req.user.id !== booking.user.toString() && req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Order cancelled successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Approve order
exports.approveBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    booking.status = "approved";
    await booking.save();

    res.json({ message: "Order approved", booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admins can delete orders" });
    }

    await booking.deleteOne();

    res.json({ message: "Order deleted by admin." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
