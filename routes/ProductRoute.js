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

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", authMiddleware, adminMiddleware, upload, createProduct);
router.put("/:id", authMiddleware, adminMiddleware, upload, updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

// Review routes - protected by authMiddleware only
router.post("/:id/reviews", authMiddleware, addReview);


module.exports = router;
