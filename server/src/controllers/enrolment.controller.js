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
    const payload = req.body;

    // Check if the student is already enrolled in the section
    try {
        await db.none(queries.enrolments.getEnrolment, [payload.student_id, payload.section_id]);
    } catch (err) {
        return res.status(400).json({
            message: `student with id '${payload.student_id}' is already enrolled in section with id '${payload.section_id}'`,
        });
    }

    // Create enrolment
    try {
        const enrolment = await db.one(queries.enrolments.createEnrolment, [payload.student_id, payload.section_id]);
        return res.status(201).json(enrolment);
    } catch (err) {
        return next(err); // unexpected error
    }
};

module.exports = {
    createEnrolment,
};
