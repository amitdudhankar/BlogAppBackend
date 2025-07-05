const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verifyToken, authorizeRoles } = require("../middlewares/auth.middleware");

// 🔐 Public Auth Routes
router.post("/signup", authController.registerUser);
router.post("/login", authController.loginUser);


// ✅ Export the router
module.exports = router;
