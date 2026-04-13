const express = require("express");
const router = express.Router();
const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

//api logic for dashboard
router.get("/", authMiddleware, (req, res) => {
  const userId = req.userId;

  // 🔹 Total Income
  const incomeQuery = `
    SELECT IFNULL(SUM(amount), 0) AS totalIncome
    FROM income
    WHERE user_id = ?
  `;

  // 🔹 Total Expense
  const expenseQuery = `
    SELECT IFNULL(SUM(amount), 0) AS totalExpense
    FROM expense
    WHERE user_id = ?
  `;

  // 🔹 Recent Transactions (combine income + expense)
  const transactionQuery = `
    SELECT id, source AS title, amount, date, 'income' AS type
    FROM income
    WHERE user_id = ?
    
    UNION ALL
    
    SELECT id, category AS title, amount, date, 'expense' AS type
    FROM expense
    WHERE user_id = ?
    
    ORDER BY date DESC
    LIMIT 5
  `;

  // Step 1: Get Income
  db.query(incomeQuery, [userId], (err, incomeResult) => {
    if (err) return res.status(500).json(err);

    // Step 2: Get Expense
    db.query(expenseQuery, [userId], (err, expenseResult) => {
      if (err) return res.status(500).json(err);

      // Step 3: Get Transactions
      db.query(transactionQuery, [userId, userId], (err, transactions) => {
        if (err) return res.status(500).json(err);

        const totalIncome = incomeResult[0].totalIncome;
        const totalExpense = expenseResult[0].totalExpense;
        const balance = totalIncome - totalExpense;

        res.json({
          totalIncome,
          totalExpense,
          balance,
          recentTransactions: transactions
        });
      });
    });
  });
});

module.exports = router;