const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const { authenticateToken } = require("./UserAuth");

// Add book to favourites
router.put("/add-book-to-favourites", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.headers;
    const userId = req.user.id; // coming from token

    if (!mongoose.Types.ObjectId.isValid(bookid) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ status: "error", message: "Invalid book ID or user ID" });
    }

    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    const isBookInFav = userData.favourites.some(
      (item) => item.toString() === bookid
    );
    if (isBookInFav) {
      return res.json({
        status: "success",
        message: "Book is already in favourites",
      });
    }

    userData.favourites.push(bookid);
    await userData.save();

    return res.json({
      status: "success",
      message: "Book added to favourites",
      favourites: userData.favourites,
    });
  } catch (error) {
    console.error("Add to favourites error:", error.message, error.stack);
    return res.status(500).json({ status: "error", message: "An error occurred" });
  }
});

// Remove book from favourites
router.put("/remove-book-from-favourites/:bookid", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.params;
    const { id } = req.headers;

    if (!mongoose.Types.ObjectId.isValid(bookid) || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: "error", message: "Invalid book ID or user ID" });
    }

    await User.findByIdAndUpdate(id, { $pull: { favourites: bookid } });

    return res.json({
      status: "success",
      message: "Book removed from favourites",
    });
  } catch (error) {
    console.error("Remove from favourites error:", error.message, error.stack);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// Get user's favourites books
router.get("/get-user-favourites", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: "error", message: "Invalid user ID" });
    }

    const userData = await User.findById(id).populate("favourites");

    if (!userData) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    return res.json({
      status: "success",
      data: userData.favourites,
    });
  } catch (error) {
    console.error("Get favourites error:", error.message, error.stack);
    return res.status(500).json({ message: "An error occurred" });
  }
});

module.exports = router;
