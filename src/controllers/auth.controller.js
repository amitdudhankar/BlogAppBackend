const authService = require("../services/auth.service");
// const { sendEmail } = require("../utils/brevoMailService"); // Optional, only if used

// ✅ Register User Controller
exports.registerUser = async (req, res) => {
    const { username, email, password, bio } = req.body;

    // 🧪 Validate required fields
    if (!username || !email || !password) {
        return res.status(400).json({
            message: "Username, Email, and Password are required.",
        });
    }

    try {
        // 🛠️ Call service to register user
        const newUser = await authService.registerUser({
            username,
            email,
            password,
            bio,
        });

        // ✅ Respond with user info + token
        return res.status(201).json({
            message: "User registered successfully",
            user: newUser,
        });
    } catch (error) {
        console.error("❌ Error in registerUser:", error.message);

        const knownConflictMessages = [
            "Email already exists.",
            "Username already exists.",
            "Email or Username already exists. Please use a different email or username.",
        ];

        if (knownConflictMessages.includes(error.message)) {
            return res.status(409).json({ message: error.message });
        }

        if (error.message.startsWith("Error while registering user:")) {
            return res.status(500).json({ message: error.message });
        }

        // ✅ Always return the actual error message even for unknown errors
        return res.status(500).json({ message: error.message, error: "Internal Server Error" });
    }
};

