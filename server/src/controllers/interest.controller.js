const db = require("../configs/db.config");
const queries = require("../utils/queries");

/**
 * Creates an interest
 *
 * @param {number} req.body.student_id - the ID of the student that likes the interest
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
    const interestId = req.params.interest_id;

    // Check if interest exists
    if (!(await interestExists(interestId))) {
        return res.status(400).json({ message: `interest with id '${interestId}' does not exist` });
    }

    // Delete interest
    try {
        await db.none(queries.interests.deleteInterest, [interestId]);
        return res.status(200).json({ message: "interest deleted" });
    } catch (err) {
        return next(err); // unexpected error
    }
};

/**
 * Updates an interest
 *
 * @param {number} req.params.interest_id - the interest's ID
 * @param {number} req.body.student_id - the new ID of the student that likes the interest
 * @param {string} req.body.interest_name - the interest's new name
 *
 * @returns
 * - 200 OK if successful
 * - 400 Bad Request if interest or student does not exist
 * - 500 Internal Server Error if unexpected error
 */
const updateInterest = async (req, res, next) => {
    const interestId = req.params.interest_id;
    const payload = req.body;

    // Check if interest exists
    if (!(await interestExists(interestId))) {
        return res.status(400).json({ message: `interest with id '${interestId}' does not exist` });
    }

    // Check if student exists
    try {
        await db.one(queries.students.getStudent, [payload.student_id]);
    } catch (err) {
        return res.status(400).json({ message: `student with id '${payload.student_id}' does not exist` });
    }

    // Update interest
    try {
        const interest = await db.one(queries.interests.updateInterest, [
            payload.student_id,
            payload.interest_name,
            interestId,
        ]);
        return res.status(200).json(interest);
    } catch (err) {
        return next(err); // unexpected error
    }
};

/**
 * Checks if a interest exists
 *
 * @param {number} studentId - the interest's ID
 *
 * @returns
 * - true if the interest exists
 * - false if the interest does not exist
 */
const interestExists = async (interestId) => {
    try {
        await db.one(queries.interests.getInterest, [interestId]);
        return true;
    } catch (err) {
        return false;
    }
};

module.exports = {
    createInterest,
    deleteInterest,
    updateInterest,
};
