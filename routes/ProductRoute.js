const express = require("express");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controller/ProductController");

const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Get all products
router.get("/", getAllProducts);

// Get product by ID
router.get("/:id", getProductById);

// Create new product with image combinations
router.post("/", authMiddleware, adminMiddleware, upload, createProduct);

// Update product
router.put("/:id", authMiddleware, adminMiddleware, upload, updateProduct);

// Delete product
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;
