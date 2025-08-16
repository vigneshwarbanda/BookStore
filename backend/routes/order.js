const router = require("express").Router();
const { authenticateToken } = require("./UserAuth");
const Book = require("../models/book");
const Order = require("../models/order");
const User = require("../models/user");

//place order
router.post("/place-order", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { order } = req.body;

    if (!order || !Array.isArray(order)) {
      return res.status(400).json({ message: "Order must be an array of book IDs" });
    }

    const orderPromises = order.map(bookId => {
      const newOrder = new Order({ user: id, book: bookId });
      return newOrder.save();
    });

    const savedOrders = await Promise.all(orderPromises);

    const orderIds = savedOrders.map(order => order._id);

    await User.findByIdAndUpdate(id, {
      $push: { orders: { $each: orderIds } },
      $pull: { cart: { $in: order } },
    });

    return res.json({
      status: "success",
      message: "Order placed successfully",
      orders: savedOrders,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

//get perticualr order hisroty
router.get("/get-order-history", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // from token
    const headerUserId = req.headers.id;

    // Check header user ID matches token user ID
    if (!headerUserId || headerUserId !== userId) {
      return res.status(403).json({ message: "Invalid user credentials." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Fetch user's orders, with populated book details
    const orders = await Order.find({ user: userId })
      .populate("book")
      .sort({ createdAt: -1 });

    return res.json({
      status: "success",
      data: orders,
    });
  } catch (error) {
    console.error("Error in /get-order-history:", error);
    return res.status(500).json({ message: "An error occurred retrieving order history." });
  }
});

//get  all order history -- admin 
router.get("/get-all-orders", authenticateToken, async (req, res) => {
  try {
    const userId = req.headers.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID missing in headers" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const orders = await Order.find()
      .populate("book")
      .populate("user") // <-- this is correct
      .sort({ createdAt: -1 });

    return res.json({ status: "success", data: orders });
  } catch (error) {
    console.error("Error in /get-all-orders:", error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// Cancel/Delete Order
router.delete("/cancel-order/:orderId", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    // Find the order to confirm ownership before deleting
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Make sure the order belongs to the authenticated user
    if (order.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to cancel this order" });
    }

    // Delete the order
    await Order.findByIdAndDelete(orderId);

    // Remove order reference from user's orders array
    await User.findByIdAndUpdate(userId, { $pull: { orders: orderId } });

    return res.json({ status: "success", message: "Order cancelled successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});




//update order --admin
router.put("/update-status", authenticateToken, async (req, res) => {
    try {
        const {id} = req.params;
        await Order.findByIdAndUpdate(id,{status:req.body.status});
        return res.json({
            status: "success",
            message:"Status Updated Successfully",
        });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "An error occurred" });
            }
 });

//
module.exports = router;
