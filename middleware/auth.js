const jwt = require("jsonwebtoken");
const userModel = require("../model/user.model");

const checkAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.user_id).select("-pass");
    console.log("Authenticated user:", decoded.user_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    console.log("Authenticated user:", user._id.toString(), "-", user.role);

    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    res.status(401).json({ error: "Invalid or expired JWT token" });
  }
};

module.exports = checkAuth;
console.log("Middleware auth is working");
