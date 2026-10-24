const express = require("express");
const { getDB } = require("../config/db");
const User = require("../models/User");

const router = express.Router();

// ========================================
// REGISTER NEW USER
// ========================================

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ----------------------------------------
    // VALIDATION
    // ----------------------------------------

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const db = getDB();

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    // ----------------------------------------
    // CHECK EMAIL ALREADY EXISTS
    // ----------------------------------------

    const existingUser = await db
      .collection("users")
      .findOne({
        email: cleanEmail,
      });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered.",
      });
    }

    // ----------------------------------------
    // CREATE USER USING MODEL
    // ----------------------------------------

    const newUser = {
      name: cleanName,
      email: cleanEmail,
      password: password,
      role: "user",
    };

    const result = await User.createUser(newUser);

    console.log("--------------------------------");
    console.log("NEW USER REGISTERED");
    console.log("NAME:", cleanName);
    console.log("EMAIL:", cleanEmail);
    console.log("USER ID:", result.insertedId);

    // ----------------------------------------
    // SUCCESS RESPONSE
    // ----------------------------------------

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: {
        id: result.insertedId,
        name: cleanName,
        email: cleanEmail,
      },
    });

  } catch (error) {
    console.error("Register error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
    });
  }
});


// ========================================
// COMMON USER + ADMIN LOGIN
// ========================================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ----------------------------------------
    // VALIDATION
    // ----------------------------------------

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const db = getDB();

    // Always normalize login email
    const cleanEmail = email.trim().toLowerCase();

    // ----------------------------------------
    // DEBUG INFO
    // ----------------------------------------

    console.log("--------------------------------");
    console.log("LOGIN EMAIL:", cleanEmail);

    const adminCount = await db
      .collection("admins")
      .countDocuments();

    const userCount = await db
      .collection("users")
      .countDocuments();

    console.log("Admins:", adminCount);
    console.log("Users:", userCount);

    // ========================================
    // CHECK ADMIN
    // ========================================

    const admin = await db
      .collection("admins")
      .findOne({
        email: {
          $regex: `^${cleanEmail}$`,
          $options: "i",
        },
      });

    console.log("ADMIN FOUND:", !!admin);

    if (admin) {
      console.log("ADMIN EMAIL IN DB:", admin.email);
      console.log("ADMIN NAME:", admin.name);
      console.log("ADMIN PASSWORD EXISTS:", !!admin.password);
    }

    // ----------------------------------------
    // ADMIN PASSWORD CHECK
    // ----------------------------------------

    if (admin && admin.password === password) {
      console.log("ADMIN LOGIN SUCCESS");

      return res.json({
        success: true,
        role: "admin",
        message: "Admin login successful",

        user: {
          id: admin._id,
          email: admin.email,
          name: admin.name || "Admin",
        },
      });
    }

    if (admin && admin.password !== password) {
      console.log("ADMIN FOUND BUT PASSWORD IS WRONG");
    }

    // ========================================
    // CHECK NORMAL USER
    // ========================================

    const user = await User.findUserByEmail(cleanEmail);

    console.log("USER FOUND:", !!user);

    if (user && user.password === password) {
      console.log("USER LOGIN SUCCESS");

      return res.json({
        success: true,
        role: "user",
        message: "User login successful",

        user: {
          id: user._id,
          email: user.email,
          name: user.name || "User",
        },
      });
    }

    // ========================================
    // INVALID LOGIN
    // ========================================

    console.log("LOGIN FAILED");

    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });

  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    });
  }
});

module.exports = router;