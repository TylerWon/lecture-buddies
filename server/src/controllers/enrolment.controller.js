const db = require("../configs/db.config");
const queries = require("../utils/queries");

/**
 * Creates an enrolment
 *
 * @param {number} req.body.student_id - the ID of the student to enrol in the section
 * @param {number} req.body.section_id - the ID of the section to enrol the student in
 *
 * @returns
 * - 201 Created if successful
 * - 400 Bad Request if the student is already enrolled in the section
 * - 500 Internal Server Error if an unexpected error occurs
 */
const createEnrolment = async (req, res, next) => {
    res.send("Not implemented");
};

module.exports = {
    createEnrolment,
};
