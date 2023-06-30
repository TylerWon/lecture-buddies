const jwt = require("jsonwebtoken");

const db = require("../configs/db.config");
const queries = require("../utils/queries");

/**
 * Authenticates a request by checking if the Authorization header contains a valid access token
 *
 * @returns
 * - 401 Unauthorized if access token is invalid
 * - Otherwise, calls the next middleware function in the stack
 */
const authenticateRequest = async (req, res, next) => {
    const authHeader = req.get("Authorization");
    const accessToken = authHeader.split(" ")[1];

    // Check if access token provided in Authorization header
    if (!accessToken) {
        return res.status(401).json({ message: "unauthorized" });
    }

    // Verify access token
    try {
        jwt.verify(accessToken, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(401).json({ message: "unauthorized" });
    }

    // Check if access token is associated with a user
    try {
        await db.one(queries.users.getUserByAccessToken, [accessToken]);
    } catch (err) {
        return res.status(401).json({ message: "unauthorized" });
    }

    next();
};

module.exports = {
    authenticateRequest,
};
