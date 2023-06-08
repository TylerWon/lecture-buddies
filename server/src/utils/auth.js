const jwt = require("jsonwebtoken");

/**
 * Authenticates a request by checking if the Authorization header contains a valid token
 *
 * @returns
 * - 401 Unauthorized if token is invalid
 * - Otherwise, calls the next middleware function in the stack
 */
const authenticateRequest = (req, res, next) => {
    const authHeader = req.get("Authorization");
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    next();
};

module.exports = {
    authenticateRequest,
};
