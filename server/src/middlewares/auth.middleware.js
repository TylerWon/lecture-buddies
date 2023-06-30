const jwt = require("jsonwebtoken");

const db = require("../configs/db.config");
const queries = require("../utils/queries");

/**
 * Authenticates a request by checking if the Authorization header contains a valid token
 *
 * @returns
 * - 401 Unauthorized if token is invalid
 * - Otherwise, calls the next middleware function in the stack
 */
const authenticateRequest = async (req, res, next) => {
    const authHeader = req.get("Authorization");
    const token = authHeader.split(" ")[1];

    // Check if token provided in Authorization header
    if (!token) {
        return res.status(401).json({ message: "unauthorized" });
    }

    // Verify token
    try {
        jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(401).json({ message: "unauthorized" });
    }

    // Check if token is associated with a user
    try {
        await db.one(queries.users.getUserByToken, [token]);
    } catch (err) {
        return res.status(401).json({ message: "unauthorized" });
    }

    next();
};

module.exports = {
    authenticateRequest,
};
