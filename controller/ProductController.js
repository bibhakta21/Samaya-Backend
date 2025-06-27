const Product = require("../model/Product");

exports.createProduct = async (req, res) => {
  try {
    const {
      shortName,
      fullName,
      price,
      rating,
      reviews,
      description,
      dialColor,
      bandColor,
      type,
      inStock
    } = req.body;

    if (!shortName || !fullName || !price || !description || !dialColor || !bandColor || !type) {
      return res.status(400).json({ error: "All required fields must be filled." });
    }

    const images = req.files.map(file => `/uploads/${file.filename}`);

    const product = new Product({
      shortName,
      fullName,
      price,
      rating,
      reviews,
      description,
      dialColor,
      bandColor,
      type,
      inStock,
      images
    });

    await product.save();
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
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
