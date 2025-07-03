const db = require('../config/db.config');

const query = async (sql, params = []) => {
    try {
        const [rows] = await db.execute(sql, params);
        return rows;
    } catch (err) {
        console.error('DB Query Error:', err.message);
        throw err;
    }
};

module.exports = query;
