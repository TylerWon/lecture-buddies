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
 * Gets a school
 *
 * @param {number} req.params.school_id - The school's ID
 *
 * @returns
 * - 200 OK if successful
 * - 400 Bad Request if school does not exist
 * - 500 Internal Server Error if unexpected error
 */
const getSchool = async (req, res, next) => {
    const schoolId = req.params.school_id;

    // Check if school exists
    if (!(await schoolExists(schoolId))) {
        return res.status(400).json({ message: `school with id '${schoolId}' does not exist` });
    }

    try {
        const school = await db.one(queries.schools.getSchool, [schoolId]);
        return res.status(200).json(school);
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
    if (!(await schoolExists(schoolId))) {
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

/**
 * Checks if a school exists
 *
 * @param {number} schoolId - the school's ID
 *
 * @returns
 * - true if the school exists
 * - false if the school does not exist
 */
const schoolExists = async (schoolId) => {
    try {
        await db.one(queries.schools.getSchool, [schoolId]);
        return true;
    } catch (err) {
        return false;
    }
};

module.exports = {
    getSchools,
    getSchool,
    getSubjectsForSchool,
};
