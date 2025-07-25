const express = require("express");
const { getDashboardData } = require("../controller/dashboardController");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();


router.get("/", authMiddleware, adminMiddleware, getDashboardData);

module.exports = router;
