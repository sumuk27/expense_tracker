const express = require("express");
const router = express.Router();
const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

//income chart
router.get("/income", authMiddleware, (req, res) => {
  const query = `
    SELECT DATE(date) as day, SUM(amount) as total
    FROM income
    WHERE user_id = ?
      AND date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    GROUP BY day
    ORDER BY day ASC
  `;

  db.query(query, [req.userId], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    res.json(results);
  });
});

//expense chart
router.get("/expense", authMiddleware, (req, res) => {
  const query = `
    SELECT DATE(date) as day, SUM(amount) as total
    FROM expense
    WHERE user_id = ?
      AND date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    GROUP BY day
    ORDER BY day ASC
  `;

  db.query(query, [req.userId], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    res.json(results);
  });
});

module.exports = router;