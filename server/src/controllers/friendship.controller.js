const db = require("../configs/db.config");
const queries = require("../utils/queries");

/**
 * Creates a friendship
 *
 * @param {number} req.body.requestor_id - the ID of the student that is requesting to be the other student’s friend
 * @param {number} req.body.requestee_id - the ID of the student that is receiving the request to be the other
 * student’s friend
 *
 * @returns
 * - 201 Created if successful
 * - 400 Bad Request if students do not exist or friendship already exists
 * - 500 Internal Server Error if unexpected error
 */
const createFriendship = async (req, res, next) => {
    const payload = req.body;

    // Check if students exist
    try {
        await db.one(queries.students.getStudent, [payload.requestor_id]);
    } catch (err) {
        return res.status(400).json({ message: `student with id '${payload.requestor_id}' does not exist` });
    }

    try {
        await db.one(queries.students.getStudent, [payload.requestee_id]);
    } catch (err) {
        return res.status(400).json({ message: `student with id '${payload.requestee_id}' does not exist` });
    }

    // Check if friendship exists
    try {
        await db.none(queries.friendships.getFriendship, [payload.requestor_id, payload.requestee_id]);
    } catch (err) {
        return res.status(400).json({
            message: `friendship already exists between students with ids '${payload.requestor_id}' and '${payload.requestee_id}'`,
        });
    }

    // Create friendship
    try {
        const friendship = await db.one(queries.friendships.createFriendship, [
            payload.requestor_id,
            payload.requestee_id,
        ]);
        return res.status(201).json(friendship);
    } catch (err) {
        return next(err); // unexpected error
    }
};

/**
 * Updates a friendship
 *
 * @param {number} req.params.requestor_id - the ID of the student that requested to be the other student’s friend
 * @param {number} req.params.requestee_id - the ID of the student that received the request to be the other student’s
 * friend
 * @param {string} req.body.friendship_status - the new status of the friendship
 *
 * @returns
 * - 200 OK if successful
 * - 400 Bad Request if friendship does not exist
 * - 500 Internal Server Error if unexpected error
 */
const updateFriendship = async (req, res, next) => {
    res.send("Not implemented");
};

module.exports = {
    createFriendship,
    updateFriendship,
};
