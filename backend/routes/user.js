const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {authenticateToken} = require("./UserAuth");

// Signup route
router.post("/sign-up", async (req, res) => {
  try {
    const { username, email, password, address } = req.body;

    // Validate username length
    if (!username || username.length < 4) {
      return res.status(400).json({ message: "Username length should be more than 4" });
    }

    // Validate password length
    if (!password || password.length < 8) {
      return res.status(400).json({ message: "Password length should be more than 8" });
    }

    // Check if username exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Check if email exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      address,
    });

    await newUser.save();

    return res.status(201).json({ message: "SignUp Successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// sign-in route
router.post("/sign-in", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input presence
    if (!username || !password) {
      return res.status(400).json({ message: "Please provide username and password" });
    }

    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Prepare payload for JWT
    const payload = {
      id: existingUser._id,
      username: existingUser.username,
      role: existingUser.role || "user",
    };

    // Sign JWT token (expires in 30 minutes)
    const token = jwt.sign(payload, "bookStore123", { expiresIn: "30m" });

    return res.status(200).json({
      message: "Sign-in successful",
      token,
      user: {
        id: existingUser._id,
        username: existingUser.username,
        role: existingUser.role || "user",
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


// Get user info
router.get("/get-user-information", authenticateToken, async (req, res) => {
  try {
    const { id } = req.user;
    const data = await User.findById(id).select('-password');
    return res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update address
router.put("/update-address", authenticateToken, async (req, res) => {
  try {
    const { id } = req.user;
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }

    await User.findByIdAndUpdate(id, { address });
    return res.status(200).json({ message: "Address updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
