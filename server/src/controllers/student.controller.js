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
 * @param {string} req.body.profil_photo_url - the url of the student's profile photo
 * @param {string} req.body.bio - the student's bio
 * @param {object[]} req.body.interests - the student's interests
 * @param {object[]} req.body.social_medias - the student's social medias
 * @param {number[]} req.body.sections - the sections the student is enrolled in
 *
 * @returns
 * - 201 Created if successful
 * - 400 Bad Request if missing or invalid body fields
 * - 500 Internal Server Error if unexpected error
 */
const createStudent = async (req, res, next) => {};

/**
 * Gets a student
 *
 * @returns
 * - 200 OK if successful
 * - 500 Internal Server Error if unexpected error
 */
const getStudent = async (req, res, next) => {};

/**
 * Gets the interests for a student
 *
 * @returns
 * - 200 OK if successful
 * - 500 Internal Server Error if unexpected error
 */
const getInterestsForStudent = async (req, res, next) => {};

/**
 * Gets the social medias for a student
 *
 * @returns
 * - 200 OK if successful
 * - 500 Internal Server Error if unexpected error
 */
const getSocialMediasForStudent = async (req, res, next) => {};

/**
 * Gets the course history for a student
 *
 * @param {string} req.query.group_by - the field to group the response by (options: term)
 * @param {string} req.query.order_by - the field to order the response by (options: -dept, +dept)
 *
 * @returns
 * - 200 OK if successful
 * - 400 Bad Request if missing or invalid query paramaters
 * - 500 Internal Server Error if unexpected error
 */
const getCourseHistoryForStudent = async (req, res, next) => {};

/**
 * Gets the classmates for a student in a section
 *
 * @param {string} req.query.order_by - the field to order the response by (options: -mutual_courses, +mutual_courses, -name, +name, -year, +year, -major, +major)
 * @param {string} req.query.offset - the position to start returning results from
 * @param {string} req.query.limit - the number of results to return
 *
 * @returns
 * - 200 OK if successful
 * - 400 Bad Request if missing or invalid query paramaters
 * - 500 Internal Server Error if unexpected error
 */
const getClassmatesForStudentInSection = async (req, res, next) => {};

/**
 * Gets the buddies for a student
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
const getBuddiesForStudent = async (req, res, next) => {};

/**
 * Gets the buddy requests for a student
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
const getBuddyRequestsForStudent = async (req, res, next) => {};

/**
 * Gets the conversation history for a student
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
const getConversationHistoryForStudent = async (req, res, next) => {};

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
