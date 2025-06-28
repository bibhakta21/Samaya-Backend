const Product = require("../model/Product");

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
