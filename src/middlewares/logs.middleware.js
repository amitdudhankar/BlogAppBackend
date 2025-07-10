// middlewares/log.middleware.js
exports.logApi = (req, res, next) => {
    const startTime = Date.now();
    const { method, originalUrl, body } = req;

    res.on("finish", () => {
        const endTime = Date.now();
        const duration = endTime - startTime;

        // ✅ Safely extract user ID
        const userId = req.user?.id || "Guest";

        // ✅ Better IP extraction
        let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress || "Unknown";
        if (ip.includes(',')) ip = ip.split(',')[0];
        ip = ip.replace(/^.*:/, '');

        // ✅ Clone body and mask sensitive data (optional)
        const safeBody = { ...body };
        if ("password" in safeBody) safeBody.password = "***";

        const log = [
            `📩 [${new Date().toLocaleString()}]`,
            `🛣️  ${method} ${originalUrl}`,
            `👤 User ID: ${userId}`,
            `🌐 IP: ${ip}`,
            `🕒 Duration: ${duration}ms`,
            `📦 Body: ${JSON.stringify(safeBody)}`,
            `✅ Status: ${res.statusCode}`
        ].join(" | ");

        console.log(log);
    });

    next();
};
