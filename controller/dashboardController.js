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


    const productOrders = await Booking.aggregate([
      { $group: { _id: "$product", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          productName: "$product.shortName",
          count: 1,
        },
      },
    ]);


    const weeklyOrders = await Booking.aggregate([
      {
        $group: {
          _id: {
            week: { $week: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.week": 1 } },
    ]);


    const orderStatus = await Booking.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);


    const contactRequests = await ContactRequest.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);


    res.json({
      totalOrders,
      totalProducts,
      totalCustomers,
      totalSalesRevenue,
      productOrders,
      weeklyOrders,
      orderStatus,
      contactRequests,
    });

  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data." });
  }
};


