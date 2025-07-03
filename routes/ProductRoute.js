const express = require("express");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addReview,
  updateReview,
  deleteReview,
} = require("../controller/ProductController");

const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Product routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", authMiddleware, adminMiddleware, upload, createProduct);
router.put("/:id", authMiddleware, adminMiddleware, upload, updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);


router.post("/:id/reviews", authMiddleware, addReview);
router.put("/:id/reviews", authMiddleware, updateReview);


module.exports = router;
