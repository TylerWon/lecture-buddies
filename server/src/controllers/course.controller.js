const db = require("../configs/db.config");
const queries = require("../utils/queries");

/**
 * Gets the sections for a course
 *
 * @param {number} req.params.course_id - The course's ID
 *
 * @returns
 * - 200 OK if successful
 * - 400 Bad Request if course does not exist
 * - 500 Internal Server Error if unexpected error
 */
const getSectionsForCourse = async (req, res, next) => {
    const courseId = req.params.course_id;

    // Check if course exists
    try {
        await db.one(queries.courses.getCourse, [courseId]);
    } catch (err) {
        return res.status(400).json({ message: `course with id ${courseId} does not exist` });
    }

    // Get sections
    try {
        const sections = await db.any(queries.courses.getSectionsForCourse, [courseId]);
        return res.status(200).json(sections);
    } catch (err) {
        return next(err); // unexpected error
    }
};

module.exports = {
    getSectionsForCourse,
};
