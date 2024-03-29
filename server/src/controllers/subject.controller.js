const db = require("../configs/db.config");
const queries = require("../utils/queries");

/**
 * Gets the courses for a subject
 *
 * @param {number} req.params.subject_id - The subject's ID
 *
 * @returns
 * - 200 OK if successful
 * - 400 Bad Request if subject does not exist
 * - 500 Internal Server Error if unexpected error
 */
const getCoursesForSubject = async (req, res, next) => {
    const subjectId = req.params.subject_id;

    // Check if subject exists
    try {
        await db.one(queries.subjects.getSubject, [subjectId]);
    } catch (err) {
        return res.status(400).json({ message: `subject with id '${subjectId}' does not exist` });
    }

    // Get courses
    try {
        const courses = await db.any(queries.subjects.getCoursesForSubject, [subjectId]);
        return res.status(200).json(courses);
    } catch (err) {
        return next(err); // unexpected error
    }
};

module.exports = {
    getCoursesForSubject,
};
