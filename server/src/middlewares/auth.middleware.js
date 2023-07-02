/**
 * Authenticates a request by checking if the user is logged in (i.e. user data is stored in session)
 *
 * @returns
 * - 401 Unauthorized if the user is not logged in
 * - Otherwise, calls the next middleware function in the stack
 */
const authenticateRequest = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "unauthenticated" });
    }

    next();
};

module.exports = {
    authenticateRequest,
};
