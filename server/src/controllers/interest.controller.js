const db = require("../configs/db.config");
const queries = require("../utils/queries");

/**
 * Creates an interest
 *
 * @param {number} req.body.student_id - the ID of the student to enrol in the section
 * @param {number} req.body.interest_name - the interest's name
 *
 * @returns
 * - 201 Created if successful
 * - 400 Bad Request if student does not exist
 * - 500 Internal Server Error if unexpected error
 */
const createInterest = async (req, res, next) => {
    const payload = req.body;

    // Check if student exists
    try {
        await db.one(queries.students.getStudent, [payload.student_id]);
    } catch (err) {
        return res.status(400).json({ message: `student with id '${payload.student_id}' does not exist` });
    }

    // Create interest
    try {
        const interest = await db.one(queries.interests.createInterest, [payload.student_id, payload.interest_name]);
        return res.status(201).json(interest);
    } catch (err) {
        console.error(err);
        return next(err); // unexpected error
    }
};

/**
 * Deletes an interest
 *
 * @param {number} req.params.interest_id - the interest's ID
 *
 * @returns
 * - 200 OK if successful
 * - 400 Bad Request if interest does not exist
 * - 500 Internal Server Error if unexpected error
 */
const deleteInterest = async (req, res, next) => {
    res.send("Not implemented");
};

/**
 * Updates an interest
 *
 * @param {number} req.params.interest_id - the interest's ID
 * @param {string} req.body.interest_name - the interest's new name
 *
 * @returns
 * - 200 OK if successful
 * - 400 Bad Request if interest does not exist
 * - 500 Internal Server Error if unexpected error
 */
const updateInterest = async (req, res, next) => {
    res.send("Not implemented");
};

module.exports = {
    createInterest,
    deleteInterest,
    updateInterest,
};
