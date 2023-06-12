const { matchedData } = require("express-validator");

const db = require("../configs/db.config");
const queries = require("../utils/queries");

/**
 * Creates a student
 *
 * @param {number} req.body.student_id - the id of the user associated with the student
 * @param {number} req.body.school_id - the id of the school the student attends
 * @param {string} req.body.first_name - the student's first name
 * @param {string} req.body.last_name - the student's last name
 * @param {string} req.body.year - the student's year of schooling
 * @param {string} req.body.faculty - the student's faculty
 * @param {string} req.body.major - the student's major
 * @param {string} req.body.profile_photo_url - the url of the student's profile photo
 * @param {string} req.body.bio - the student's bio
 *
 * @returns
 * - 201 Created if successful
 * - 400 Bad Request if missing or invalid body fields
 * - 500 Internal Server Error if unexpected error
 */
const createStudent = async (req, res, next) => {
    const payload = matchedData(req);

    // Check if user exists
    try {
        await db.one(queries.users.getUser, [payload.student_id]);
    } catch (err) {
        return res.status(400).json({
            message: `user with id '${payload.student_id}' does not exist`,
        });
    }

    // Check if school exists
    try {
        await db.one(queries.schools.getSchool, [payload.school_id]);
    } catch (err) {
        return res.status(400).json({
            message: `school with id '${payload.school_id}' does not exist`,
        });
    }

    // Create student
    try {
        const student = await db.one(queries.students.createStudent, [
            payload.student_id,
            payload.school_id,
            payload.first_name,
            payload.last_name,
            payload.year,
            payload.faculty,
            payload.major,
            payload.profile_photo_url,
            payload.bio,
        ]);
        return res.status(201).json(student);
    } catch (err) {
        return next(err); // unexpected error
    }
};

/**
 * Gets a student
 *
 * @returns
 * - 200 OK if successful
 * - 500 Internal Server Error if unexpected error
 */
const getStudent = async (req, res, next) => {
    res.send("Not implemented");
};

/**
 * Gets the interests for a student
 *
 * @returns
 * - 200 OK if successful
 * - 500 Internal Server Error if unexpected error
 */
const getInterestsForStudent = async (req, res, next) => {
    res.send("Not implemented");
};

/**
 * Gets the social medias for a student
 *
 * @returns
 * - 200 OK if successful
 * - 500 Internal Server Error if unexpected error
 */
const getSocialMediasForStudent = async (req, res, next) => {
    res.send("Not implemented");
};

/**
 * Gets the course history for a student. The course history is all the courses a student has taken. Information about
 * the subject, course, and section is included.
 *
 * @param {string} req.query.group_by the field to group the response by (options: term)
 * @param {string} req.query.order_by the field to order the response by (options: -dept, +dept)
 *
 * @returns
 * - 200 OK if successful
 * - 400 Bad Request if missing or invalid query paramaters
 * - 500 Internal Server Error if unexpected error
 */
const getCourseHistoryForStudent = async (req, res, next) => {
    res.send("Not implemented");
};

/**
 * Gets the classmates for a student in a section. Information about each classmate and their interests, social medias,
 * and current/previous mutual/non-mutual courses with the student is included.
 *
 * @param {string} req.query.order_by - the field to order the response by (options: -mutual_courses, +mutual_courses,
 * -name, +name, -year, +year, -major, +major)
 * @param {string} req.query.offset - the position to start returning results from
 * @param {string} req.query.limit - the number of results to return
 *
 * @returns
 * - 200 OK if successful
 * - 400 Bad Request if missing or invalid query paramaters
 * - 500 Internal Server Error if unexpected error
 */
const getClassmatesForStudentInSection = async (req, res, next) => {
    res.send("Not implemented");
};

/**
 * Gets the buddies for a student. Information about each buddy and their interests, social medias, and
 * current/previous mutual/non-mutual courses with the student is included.
 *
 * @param {string} req.query.order_by - the field to order the response by (options: -name, +name)
 * @param {string} req.query.offset - the position to start returning results from
 * @param {string} req.query.limit - the number of results to return
 *
 * @returns
 * - 200 OK if successful
 * - 400 Bad Request if missing or invalid query paramaters
 * - 500 Internal Server Error if unexpected error
 */
const getBuddiesForStudent = async (req, res, next) => {
    res.send("Not implemented");
};

/**
 * Gets the buddy requests for a student. Information about each requestor and their interests, social medias, and
 * current/previous mutual/non-mutual courses with the student is included.
 *
 * @param {string} req.query.order_by - the field to order the response by (options: -name, +name)
 * @param {string} req.query.offset - the position to start returning results from
 * @param {string} req.query.limit - the number of results to return
 *
 * @returns
 * - 200 OK if successful
 * - 400 Bad Request if missing or invalid query paramaters
 * - 500 Internal Server Error if unexpected error
 */
const getBuddyRequestsForStudent = async (req, res, next) => {
    res.send("Not implemented");
};

/**
 * Gets the conversation history for a student. The conversation history is all the conversations a student has had.
 * Information about the conversation and messages is included.
 *
 * @param {string} req.query.order_by - the field to order the response by (options: -date, +date)
 * @param {string} req.query.offset - the position to start returning results from
 * @param {string} req.query.limit - the number of results to return
 *
 * @returns
 * - 200 OK if successful
 * - 400 Bad Request if missing or invalid query paramaters
 * - 500 Internal Server Error if unexpected error
 */
const getConversationHistoryForStudent = async (req, res, next) => {
    res.send("Not implemented");
};

module.exports = {
    createStudent,
    getStudent,
    getInterestsForStudent,
    getSocialMediasForStudent,
    getCourseHistoryForStudent,
    getClassmatesForStudentInSection,
    getBuddiesForStudent,
    getBuddyRequestsForStudent,
    getConversationHistoryForStudent,
};
