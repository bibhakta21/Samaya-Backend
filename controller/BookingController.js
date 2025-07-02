const Booking = require("../model/Booking");
const Product = require("../model/Product");

// Create new order
// New booking logic with partial/null info
exports.createBooking = async (req, res) => {
  try {
    console.log("Authenticated user:", req.user);  // DEBUG

    const userId = req.user?.id || req.user?._id;  // safe access
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User not found in request" });
    }

    const {
      productId,
      quantity,
      productImage,
      productShortName,
      price,
      addressOne,
      country,
      number,
      paymentType,
      dialColor,
      bandColor
    } = req.body;


    if (!productId || !quantity) {
      return res.status(400).json({ message: "productId and quantity are required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const newBooking = new Booking({
      user: userId,
      product: productId,
      quantity,
      productImage,
      productShortName,
      price,
      addressOne,
      country,
      number,
      paymentType,
      dialColor,
      bandColor,
      status: "pending",
    });


    await newBooking.save();

    res.status(201).json({ message: "Booking created successfully", booking: newBooking });
  } catch (error) {
    console.error("Booking creation error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (req.user.id !== booking.user.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const {
      addressOne,
      country,
      number,
      paymentType,
      quantity
    } = req.body;

    if (addressOne) booking.addressOne = addressOne;
    if (country) booking.country = country;
    if (number) booking.number = number;
    if (paymentType) booking.paymentType = paymentType;
    if (quantity) booking.quantity = quantity;

    await booking.save();
    res.json({ message: "Booking updated successfully", booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get all bookings for current user
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).sort({ createdAt: -1 });
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
