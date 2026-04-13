const jwt = require("jsonwebtoken");

const SECRET_KEY = "mysecretkey";

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];

  // ❌ No token
  if (!authHeader) {
    return res.status(401).json({
      message: "No token provided"
    });
  }

  try {
    // ✅ Extract token
    const token = authHeader.split(" ")[1];

    // ✅ Verify token
    const decoded = jwt.verify(token, SECRET_KEY);

    // ✅ Store user id
    req.userId = decoded.id;

    next(); // continue
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token"
    });
  }
}

module.exports = authMiddleware;