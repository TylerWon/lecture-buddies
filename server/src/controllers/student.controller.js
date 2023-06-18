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
    const payload = req.body;

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
 * @param {number} req.params.student_id - The student's ID
 *
 * @returns
 * - 200 OK if successful
 * - 500 Internal Server Error if unexpected error
 */
const getStudent = async (req, res, next) => {
    const studentId = req.params.student_id;

    try {
        const student = await db.oneOrNone(queries.students.getStudent, [studentId]);
        return res.json(student);
    } catch (err) {
        return next(err); // unexpected error
    }
};

/**
 * Gets the interests for a student
 *
 * @param {number} req.params.student_id - The student's ID
 *
 * @returns
 * - 200 OK if successful
 * - 500 Internal Server Error if unexpected error
 */
const getInterestsForStudent = async (req, res, next) => {
    const studentId = req.params.student_id;

    try {
        const interests = await db.any(queries.students.getInterestsForStudent, [studentId]);
        return res.json(interests);
    } catch (err) {
        return next(err); // unexpected error
    }
};

/**
 * Gets the social medias for a student
 *
 * @param {number} req.params.student_id - The student's ID
 *
 * @returns
 * - 200 OK if successful
 * - 500 Internal Server Error if unexpected error
 */
const getSocialMediasForStudent = async (req, res, next) => {
    const studentId = req.params.student_id;

    try {
        const socialMedias = await db.any(queries.students.getSocialMediasForStudent, [studentId]);
        return res.json(socialMedias);
    } catch (err) {
        return next(err); // unexpected error
    }
};

/**
 * Gets the course history for a student. The course history is all the courses a student has taken. Information about
 * the subject, course, and section is included.
 *
 * @param {number} req.params.student_id - The student's ID
 * @param {string} req.query.order_by - the field to order the response by (options: name, -name)
 *
 * @returns
 * - 200 OK if successful
 * - 400 Bad Request if missing or invalid query paramaters
 * - 500 Internal Server Error if unexpected error
 */
const getCourseHistoryForStudent = async (req, res, next) => {
    const studentId = req.params.student_id;
    const orderBy = req.query.order_by;

    try {
        let courseHistory;

        switch (orderBy) {
            case "name":
                courseHistory = await db.any(queries.students.getCourseHistoryForStudentOrderByNameASC, [studentId]);
                break;
            case "-name":
                courseHistory = await db.any(queries.students.getCourseHistoryForStudentOrderByNameDESC, [studentId]);
                break;
            default:
                return res.status(400).json({ message: "invalid query parameters" });
        }

        return res.json(courseHistory);
    } catch (err) {
        return next(err); // unexpected error
    }
};

/**
 * Gets the classmates for a student in a section. Information about each classmate and their interests, social medias,
 * and current mutual courses with the student is included.
 *
 * @param {number} req.params.student_id - The student's ID
 * @param {number} req.params.section_id - The section's ID
 * @param {string} req.query.order_by - the field to order the response by (options: num_mutual_courses,
 * -num_mutual_courses, name, -name, year, -year, major, -major)
 * @param {string} req.query.offset - the position to start returning results from
 * @param {string} req.query.limit - the number of results to return
 *
 * @returns
 * - 200 OK if successful
 * - 400 Bad Request if missing or invalid query paramaters
 * - 500 Internal Server Error if unexpected error
 */
const getClassmatesForStudentInSection = async (req, res, next) => {
    const studentId = req.params.student_id;
    const sectionId = req.params.section_id;
    const orderBy = req.query.order_by;
    const offset = req.query.offset;
    const limit = req.query.limit;

    // Check if student is enrolled in section
    try {
        await db.one(queries.enrolments.getEnrolment, [studentId, sectionId]);
    } catch (err) {
        return res.json([]);
    }

    try {
        // Get classmates
        let classmates = await db.any(queries.students.getClassmatesForStudentInSection, [studentId, sectionId]);

        // Get current mutual courses for each classmate
        for (const classmate of classmates) {
            const currentMutualCourses = await db.any(queries.students.getCurrentMutualCoursesForTwoStudents, [
                studentId,
                classmate.student_id,
            ]);
            classmate.current_mutual_courses = currentMutualCourses;
        }

        // Sort classmates
        switch (orderBy) {
            case "num_mutual_courses":
                classmates.sort((a, b) => a.current_mutual_courses.length - b.current_mutual_courses.length);
                break;
            case "-num_mutual_courses":
                classmates.sort((a, b) => b.current_mutual_courses.length - a.current_mutual_courses.length);
                break;
            case "name":
                classmates.sort((a, b) => {
                    const aName = `${a.first_name} ${a.last_name}`;
                    const bName = `${b.first_name} ${b.last_name}`;
                    return aName.localeCompare(bName);
                });
                break;
            case "-name":
                classmates.sort((a, b) => {
                    const aName = `${a.first_name} ${a.last_name}`;
                    const bName = `${b.first_name} ${b.last_name}`;
                    return bName.localeCompare(aName);
                });
                break;
            case "year":
                classmates.sort((a, b) => a.year - b.year);
                break;
            case "-year":
                classmates.sort((a, b) => b.year - a.year);
                break;
            case "major":
                classmates.sort((a, b) => a.major.localeCompare(b.major));
                break;
            case "-major":
                classmates.sort((a, b) => b.major.localeCompare(a.major));
                break;
            default:
                return res.status(400).json({ message: "invalid query parameters" });
        }

        // Paginate classmates
        classmates = classmates.slice(offset, offset + limit);

        // Get interests for each classmate
        for (const classmate of classmates) {
            const interests = await db.any(queries.students.getInterestsForStudent, [classmate.student_id]);
            classmate.interests = interests;
        }

        // Get social medias for each classmate
        for (const classmate of classmates) {
            const socialMedias = await db.any(queries.students.getSocialMediasForStudent, [classmate.student_id]);
            classmate.social_medias = socialMedias;
        }

        return res.json(classmates);
    } catch (err) {
        return next(err); // unexpected error
    }
};

/**
 * Gets the buddies for a student. Information about each buddy and their interests, social medias, and
 * current/previous mutual courses with the student is included.
 *
 * @param {number} req.params.student_id - The student's ID
 * @param {string} req.query.order_by - the field to order the response by (options: name, -name)
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
 * current mutual courses with the student is included.
 *
 * @param {number} req.params.student_id - The student's ID
 * @param {string} req.query.order_by - the field to order the response by (options: name, -name)
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
 * @param {number} req.params.student_id - The student's ID
 * @param {string} req.query.order_by - the field to order the response by (options: date, -date)
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
