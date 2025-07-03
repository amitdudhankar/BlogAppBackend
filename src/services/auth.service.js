const query = require("../utils/db"); // mysql2 connection pool wrapper
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ✅ Register User Service
exports.registerUser = async ({ username, email, password, bio }) => {
    try {
        // Validation
        if (!password) throw new Error("Password is required");
        if (!username || !email) {
            throw new Error("Username and Email are required.");
        }

        // 🔍 Check for existing email or username
        const existingUser = await query(
            "SELECT * FROM users WHERE email = ? OR username = ?",
            [email, username]
        );

        if (existingUser.length > 0) {
            const conflictField =
                existingUser[0].email === email
                    ? "Email"
                    : existingUser[0].username === username
                        ? "Username"
                        : "Email or Username";

            throw new Error(`${conflictField} already exists.`);
        }

        // 🔐 Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 💾 Insert user into the database
        const result = await query(
            `INSERT INTO users (username, email, password, bio, created_at)
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
            [username, email, hashedPassword, bio || null]
        );

        const userId = result.insertId;

        // 🔑 Create JWT
        const payload = { id: userId, username, email };
        const token = jwt.sign(payload, process.env.SECRET_JWT_KEY, {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d",
        });

        // ✅ Return user info
        return {
            id: userId,
            username,
            email,
            bio,
            token,
        };
    } catch (error) {
        console.error("Error in registerUser service:", error);

        if (
            error.message.includes("Email already exists") ||
            error.message.includes("Username already exists")
        ) {
            throw new Error(error.message);
        }

        if (error.code === "ER_DUP_ENTRY") {
            throw new Error("Duplicate entry. Email or Username already exists.");
        }

        throw new Error("Error while registering user: " + error.message);
    }
};