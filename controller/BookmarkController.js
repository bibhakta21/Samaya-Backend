const Bookmark = require("../model/Bookmark");
const Product = require("../model/Product");

exports.toggleBookmark = async (req, res) => {
  const userId = req.user.id; // use decoded token id
  const productId = req.params.productId;

  try {
    const existing = await Bookmark.findOne({ user: userId, product: productId });

    if (existing) {
      await Bookmark.findByIdAndDelete(existing._id);
      return res.json({ message: "Bookmark removed" });
    } else {
      const bookmark = new Bookmark({ user: userId, product: productId });
      await bookmark.save();
      return res.status(201).json({ message: "Product bookmarked" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserBookmarks = async (req, res) => {
  const userId = req.user.id; // use decoded token id
  try {
    const bookmarks = await Bookmark.find({ user: userId }).populate("product");
    const products = bookmarks.map((b) => b.product);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
