const db = require("../configs/db.config");
const queries = require("../utils/queries");

const getSchools = async (req, res, next) => {
    try {
        const schools = await db.any(queries.schools.getSchools);
        return res.json(schools);
    } catch (err) {
        return next(err); // unexpected error
    }
};

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
