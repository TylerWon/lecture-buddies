const db = require("../configs/db.config");
const queries = require("../utils/queries");

/**
 * Gets the courses for a subject
 *
 * @param {number} req.params.subject_id - The subject's ID
 *
 * @returns
 * - 200 OK if successful
 * - 500 Internal Server Error if unexpected error
 */
const getCoursesForSubject = async (req, res, next) => {
    const subjectId = req.params.subject_id;

    try {
        const courses = await db.any(queries.subjects.getCoursesForSubject, [subjectId]);
        return res.json(courses);
    } catch (err) {
        return next(err); // unexpected error
    }
};

module.exports = {
    getCoursesForSubject,
};
