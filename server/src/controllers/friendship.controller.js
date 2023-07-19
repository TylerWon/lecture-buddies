const pgp = require("pg-promise")();

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
    const requestor_id = req.params.requestor_id;
    const requestee_id = req.params.requestee_id;
    const payload = req.body;

    // Check if friendship exists
    try {
        await db.one(queries.friendships.getFriendship, [requestor_id, requestee_id]);
    } catch (err) {
        return res.status(400).json({
            message: `friendship between students with ids '${requestor_id}' and '${requestee_id}' does not exist`,
        });
    }

    // Update friendship
    try {
        // Dynamically construct query based on fields in payload
        const condition = pgp.as.format(
            "WHERE requestor_id = $1 AND requestee_id = $2 OR requestor_id = $2 AND requestee_id = $1",
            [requestor_id, requestee_id]
        );
        const query = `${pgp.helpers.update(payload, null, "friendships")} ${condition} RETURNING *`;

        const friendship = await db.one(query);
        return res.status(200).json(friendship);
    } catch (err) {
        return next(err); // unexpected error
    }
};

module.exports = {
    createFriendship,
    updateFriendship,
};
