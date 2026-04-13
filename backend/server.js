const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

// middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ connect routes BEFORE listen
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// 💰 Income routes 
const incomeRoutes = require("./routes/income");
app.use("/api/income", incomeRoutes);

// 💸 Expense routes
const expenseRoutes = require("./routes/expense");
app.use("/api/expense", expenseRoutes);

// 📊 Dashboard route
const dashboardRoutes = require("./routes/dashboard");
app.use("/api/dashboard", dashboardRoutes);

// 📈 Charts route
const chartRoutes = require("./routes/charts");
app.use("/api/charts", chartRoutes);

// 🔒 Auth Middleware and test route
app.get("/api/test", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route working",
    userId: req.userId
  });
});

// test route
app.get("/", (req, res) => {
  res.send("API Running...");
});

// start server
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});