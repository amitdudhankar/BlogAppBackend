const jwt = require("jsonwebtoken");
require("dotenv").config();

// ✅ Middleware: Verify JWT Token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access denied. Token missing or malformed." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.SECRET_JWT_KEY);
        req.user = decoded; // decoded contains userId, role, etc.
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token." });
    }
};

// ✅ Middleware: Role-Based Access Control
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user?.role;

        if (!userRole || !allowedRoles.includes(userRole)) {
            return res.status(403).json({
                message: "Access denied. You don't have permission for this action.",
            });
        }

        next();
    };
};

module.exports = {
    verifyToken,
    authorizeRoles,
};
