const router = require("express").Router();
const User = require("../models/user");
const { authenticateToken } = require("./UserAuth");  

//put book to cart
const mongoose = require("mongoose");

router.put("/add-to-cart", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(bookid) || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: "error", message: "Invalid book ID or user ID" });
    }

    const userData = await User.findById(id);
    if (!userData) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    // Check if book already exists in cart
    const isBookInCart = userData.cart.some(
      (item) => item.toString() === bookid
    );
    if (isBookInCart) {
      return res.json({
        status: "success",
        message: "Book is already in cart",
      });
    }

    // Add book to cart and save
    userData.cart.push(bookid);
    await userData.save();

    return res.json({
      status: "success",
      message: "Book added to cart",
      cart: userData.cart, // Send updated cart
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    return res.status(500).json({ status: "error", message: "An error occurred" });
  }
});


//remove book from cart
router.put("/remove-from-cart/:bookid", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.params;
    const { id } = req.headers;

    await User.findByIdAndUpdate(id, {
      $pull: { cart: bookid },
    });

    return res.json({
      status: "success",
      message: "Book removed from cart",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});


router.get("/get-user-cart", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate("cart");
    return res.json({
      status: "Success",
      data: userData.cart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

module.exports = router;
