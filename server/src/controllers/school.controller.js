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
        return res.json(schools);
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
 * - 500 Internal Server Error if unexpected error
 */
const getSubjectsForSchool = async (req, res, next) => {
    const schoolId = req.params.school_id;

    try {
        const subjects = await db.any(queries.schools.getSubjectsForSchool, [schoolId]);
        return res.json(subjects);
    } catch (err) {
        return next(err); // unexpected error
    }
};

module.exports = {
    getSchools,
    getSubjectsForSchool,
};
