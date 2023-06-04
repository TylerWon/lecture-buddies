const db = require("../configs/db.config");
const queries = require("../utils/queries");

/**
 * Gets the sections for a course
 *
 * @param {number} req.params.course_id - The course's ID
 *
 * @returns
 * - 200 OK if successful
 * - 500 Internal Server Error if unexpected error
 */
const getSectionsForCourse = async (req, res, next) => {
    const courseId = req.params.course_id;

    try {
        const sections = await db.any(queries.courses.getSectionsForCourse, [courseId]);
        return res.json(sections);
    } catch (err) {
        return next(err); // unexpected error
    }
};

module.exports = {
    getSectionsForCourse,
};