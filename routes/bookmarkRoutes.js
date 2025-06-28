const express = require("express");
const { toggleBookmark, getUserBookmarks } = require("../controller/BookmarkController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:productId", authMiddleware, toggleBookmark);
router.get("/", authMiddleware, getUserBookmarks);

module.exports = router;
