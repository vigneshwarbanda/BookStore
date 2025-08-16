const router = require("express").Router();
const User = require("../models/user");
const { authenticateToken } = require("./UserAuth");
const bcrypt = require("bcryptjs");


// Add User - Admin only
router.post("/add-user", authenticateToken, async (req, res) => {
  try {
    const adminId = req.user.id;

    // Verify the requester is admin
    const adminUser = await User.findById(adminId);
    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const { username, email, password, role, address } = req.body;

    // Basic validation
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role value" });
    }

    // Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res.status(409).json({ message: "Username or email already in use" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
      address: address || "",
    });

    await newUser.save();

    // Return user data without password
    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.status(201).json({
      status: "Success",
      message: "User created successfully",
      data: userResponse,
    });
  } catch (error) {
    console.error("Add user error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});



// Get all users - admin only
router.get("/get-all-users", authenticateToken, async (req, res) => {
  try {
    // Get user id from the token (better security than headers)
    const userId = req.user.id;

    // Find user in DB
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is admin
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Fetch all users without passwords, sorted newest first
    const users = await User.find({}, "-password").sort({ createdAt: -1 });

    return res.status(200).json({
      status: "Success",
      data: users,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update a user - Admin only


router.patch("/update-user/:id", authenticateToken, async (req, res) => {
  try {
    const adminId = req.user.id;

    // Fetch the admin user making the request
    const adminUser = await User.findById(adminId);
    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const userIdToUpdate = req.params.id;
    const updates = { ...req.body };

    // Only allow admins to update role
    if (updates.role && !["user", "admin"].includes(updates.role)) {
      return res.status(400).json({ message: "Invalid role value" });
    }

    // Handle password update
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    // Prevent updating _id manually
    delete updates._id;

    const updatedUser = await User.findByIdAndUpdate(userIdToUpdate, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      status: "Success",
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//delete user -- admin
router.delete("/delete-user/:id", authenticateToken, async (req, res) => {
  try {
    const adminId = req.user.id;

    // Verify that the requesting user is an admin
    const adminUser = await User.findById(adminId);
    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const userIdToDelete = req.params.id;

    const deletedUser = await User.findByIdAndDelete(userIdToDelete);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      status: "Success",
      message: "User deleted successfully",
      data: {
        id: deletedUser._id,
        name: deletedUser.name,
        email: deletedUser.email,
      },
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});



module.exports = router;
