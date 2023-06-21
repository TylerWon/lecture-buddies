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
 * - 400 Bad Request if the student does not exist
 * - 500 Internal Server Error if an unexpected error occurs
 */
const createInterest = async (req, res, next) => {
    res.send("Not implemented");
};

module.exports = {
    createInterest,
};
