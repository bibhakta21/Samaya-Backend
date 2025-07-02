const Product = require("../model/Product");
const User = require("../model/User");

exports.createProduct = async (req, res) => {
  try {
    const {
      shortName,
      fullName,
      price,
      discountPrice,
      description,
      type,
      inStock,
    } = req.body;

    const dialColors = req.body.dialColor; // from form
    const bandColors = req.body.bandColor;
    const imageFiles = req.files.images;

    // Validate required fields
    if (
      !shortName || !fullName || !price || !description || !type ||
      !dialColors || !bandColors || !imageFiles
    ) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Normalize inputs
    const dialColorArr = Array.isArray(dialColors) ? dialColors : [dialColors];
    const bandColorArr = Array.isArray(bandColors) ? bandColors : [bandColors];
    const images = Array.isArray(imageFiles) ? imageFiles : [imageFiles];

    // Ensure counts match
    if (
      dialColorArr.length !== bandColorArr.length ||
      dialColorArr.length !== images.length
    ) {
      return res.status(400).json({ error: "Mismatch in image combinations." });
    }

    // Map combinations
    const imageCombinations = dialColorArr.map((dial, idx) => ({
      dialColor: dial,
      bandColor: bandColorArr[idx],
      imageUrl: `/uploads/${images[idx].filename}`,
    }));

    const product = new Product({
      shortName,
      fullName,
      price,
      discountPrice,
      description,
      type,
      inStock,
      imageCombinations,
    });

    await product.save();

    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    let updatedData = req.body;

    if (req.files && req.files.length > 0) {
      updatedData.images = req.files.map(file => `/uploads/${file.filename}`);
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!updatedProduct) return res.status(404).json({ error: "Product not found" });

    res.json({ message: "Product updated successfully", updatedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ error: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Calculate average rating helper
const calculateAverageRating = (reviews) => {
  if (!reviews.length) return 5;
  const total = reviews.reduce((acc, r) => acc + r.rating, 0);
  return parseFloat((total / reviews.length).toFixed(1));
};

// Add review
exports.addReview = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ error: "Not authenticated" });

    const { rating, comment } = req.body;
    const userId = req.user.id;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const existingReview = product.reviews.find(r => r.user.toString() === userId);
    if (existingReview) return res.status(400).json({ error: "You already reviewed this product" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const newReview = {
      user: userId,
      username: user.username,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(newReview);
    product.rating = calculateAverageRating(product.reviews);

    await product.save();

    res.json({
      message: "Review added",
      reviews: product.reviews,
      rating: product.rating,
    });
  } catch (error) {
    console.error("Add Review Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update review
exports.updateReview = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ error: "Not authenticated" });

    const { rating, comment } = req.body;
    const userId = req.user.id;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const review = product.reviews.find(r => r.user.toString() === userId);
    if (!review) return res.status(404).json({ error: "Review not found" });

    if (rating !== undefined) review.rating = Number(rating);
    if (comment !== undefined) review.comment = comment;

    product.rating = calculateAverageRating(product.reviews);
    await product.save();

    res.json({
      message: "Review updated",
      reviews: product.reviews,
      rating: product.rating,
    });
  } catch (error) {
    console.error("Update Review Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete review
exports.deleteReview = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ error: "Not authenticated" });

    const { id: productId, reviewId } = req.params;
    const userId = req.user.id;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const review = product.reviews.id(reviewId);
    if (!review) return res.status(404).json({ error: "Review not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isAdmin = user.role === "admin";
    const isOwner = review.user.toString() === userId;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: "Not authorized to delete this review" });
    }

    // Instead of review.remove(), do this:
    product.reviews.pull(reviewId);

    product.rating = calculateAverageRating(product.reviews);
    await product.save();

    res.json({
      message: "Review deleted",
      reviews: product.reviews,
      rating: product.rating,
    });
  } catch (error) {
    console.error("Delete Review Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
