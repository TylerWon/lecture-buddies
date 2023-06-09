const db = require("../configs/db.config");
const queries = require("../utils/queries");

/**
 * Gets all schools
 *
 * @returns
 * - 200 OK if successful
 * - 500 Internal Server Error if unexpected error
 */
const getSchools = async (req, res, next) => {
    try {
        const schools = await db.any(queries.schools.getSchools);
        return res.status(200).json(schools);
    } catch (err) {
        return next(err); // unexpected error
    }
};

/**
 * Gets the subjects for a school
 *
 * @param {number} req.params.school_id - The school's ID
 *
 * @returns
 * - 200 OK if successful
 * - 400 Bad Request if school does not exist
 * - 500 Internal Server Error if unexpected error
 */
const getSubjectsForSchool = async (req, res, next) => {
    const schoolId = req.params.school_id;

    // Check if school exists
    try {
        await db.one(queries.schools.getSchool, [schoolId]);
    } catch (err) {
        return res.status(400).json({ message: `school with id '${schoolId}' does not exist` });
    }

    // Get subjects
    try {
        const subjects = await db.any(queries.schools.getSubjectsForSchool, [schoolId]);
        return res.status(200).json(subjects);
    } catch (err) {
        return next(err); // unexpected error
    }
};

module.exports = {
    getSchools,
    getSubjectsForSchool,
};
