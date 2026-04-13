const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "mysecretkey";


// ======================
// ✅ REGISTER API
// ======================
router.post("/register", async (req, res) => {
  const { name, email, password, age, phone, address } = req.body;

  // ✅ Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, email and password are required"
    });
  }

  try {
    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🗄️ Insert into DB
    const query = `
      INSERT INTO users (name, email, password, age, phone, address)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [name, email, hashedPassword, age, phone, address],
      (err, result) => {
        if (err) {
          // 🔴 Duplicate email error
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
              message: "Email already exists"
            });
          }

          return res.status(500).json({
            message: "Database error",
            error: err
          });
        }

        res.json({
          message: "User registered successfully"
        });
      }
    );

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error
    });
  }
});

// ======================
// ✅ LOGIN API
// ======================

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // ✅ validation
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password required"
    });
  }

  // 🔍 check user
  const query = "SELECT * FROM users WHERE email = ?";

  db.query(query, [email], async (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (results.length === 0) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    const user = results[0];

    // 🔐 compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password"
      });
    }

    // 🎟️ generate token
    const token = jwt.sign(
      { id: user.id },
      SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token: token,
      user: {
        id: user.id,
        name: user.name
      }
    });
  });
});


//profile api
const authMiddleware = require("../middleware/authMiddleware");

// 👤 Get Profile
router.get("/profile", authMiddleware, (req, res) => {
  const query = `
    SELECT id, name, email, age, phone, address
    FROM users
    WHERE id = ?
  `;

  db.query(query, [req.userId], (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(results[0]);
  });
});


module.exports = router;