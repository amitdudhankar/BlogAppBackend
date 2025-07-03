const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verifyToken, authorizeRoles } = require("../middlewares/auth.middleware");

// 🔐 Public Auth Routes
router.post("/signup", authController.registerUser);


// ✅ Export the router
module.exports = router;
