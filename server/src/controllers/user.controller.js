const db = require("../configs/db.config");
const queries = require("../utils/queries");

/**
 * Deletes a user
 *
 * @param {number} req.params.user_id - The user's ID
 *
 * @returns
 * - 200 OK if successful
 * - 400 Bad Request if user does not exist
 * - 500 Internal Server Error if unexpected error
 */
const deleteUser = async (req, res, next) => {
    const userId = req.params.user_id;

    // Check if user exists
    try {
        await db.one(queries.users.getUser, [userId]);
    } catch (err) {
        return res.status(400).json({ message: `user with id '${userId}' does not exist` });
    }

    // Delete user
    try {
        await db.none(queries.users.deleteUser, [userId]);
        return res.status(200).json({ message: `user with id '${userId}' deleted` });
    } catch (err) {
        return next(err); // unexpected error
    }
};

module.exports = {
    deleteUser,
};
