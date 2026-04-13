const express = require("express");
const router = express.Router();
const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");


// add expense api
router.post("/", authMiddleware, (req, res) => {
  const { category, amount, date } = req.body;

  if (!category || !amount || !date) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  const query = `
    INSERT INTO expense (user_id, category, amount, date)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    query,
    [req.userId, category, amount, date],
    (err, result) => {
      if (err) {
        console.log("SQL ERROR:", err);
        return res.status(500).json(err);
      }

      res.json({
        message: "Expense added successfully"
      });
    }
  );
});


//get expense api
router.get("/", authMiddleware, (req, res) => {
  const query = `
    SELECT * FROM expense
    WHERE user_id = ?
    ORDER BY date DESC
  `;

  db.query(query, [req.userId], (err, results) => {
    if (err) {
      console.log("SQL ERROR:", err);
      return res.status(500).json(err);
    }

    res.json(results);
  });
});


//delete expense api
router.delete("/:id", authMiddleware, (req, res) => {
  const expenseId = req.params.id;

  const query = `
    DELETE FROM expense
    WHERE id = ? AND user_id = ?
  `;

  db.query(query, [expenseId, req.userId], (err, result) => {
    if (err) {
      console.log("SQL ERROR:", err);
      return res.status(500).json(err);
    }

    res.json({
      message: "Expense deleted successfully"
    });
  });
});

module.exports = router;