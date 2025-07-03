const Booking = require("../model/Booking");
const Product = require("../model/Product");
const User = require("../model/User");
const ContactRequest = require("../model/ContactRequest");

exports.getDashboardData = async (req, res) => {
  try {
    
    const totalOrders = await Booking.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await User.countDocuments({ role: "user" });

    
    const totalSalesAggregate = await Booking.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ["$price", "$quantity"] } },
        },
      },
    ]);
    const totalSalesRevenue = totalSalesAggregate[0]?.total || 0;
  }
};
