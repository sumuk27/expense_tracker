const express = require("express");
const router = express.Router();
const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

// add income api
router.post("/", authMiddleware, (req, res) => {
  const { source, amount, date } = req.body;

  if (!source || !amount || !date) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  const query = `
    INSERT INTO income (user_id, source, amount, date)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    query,
    [req.userId, source, amount, date],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "Income added successfully"
      });
    }
  );
});


//get income api
router.get("/", authMiddleware, (req, res) => {
  const query = `
    SELECT * FROM income
    WHERE user_id = ?
    ORDER BY date DESC
  `;

  db.query(query, [req.userId], (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(results);
  });
});

//delete income api
router.delete("/:id", authMiddleware, (req, res) => {
  const incomeId = req.params.id;

  const query = `
    DELETE FROM income
    WHERE id = ? AND user_id = ?
  `;

  db.query(query, [incomeId, req.userId], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Income deleted successfully"
    });
  });
});

module.exports = router;