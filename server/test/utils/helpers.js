require("dotenv").config();

const request = require("supertest");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const queries = require("../utils/queries");

/**
 * Creates a buddy
 *
 * @param {object} db - the database connection
 * @param {number} requestorId - the id of the student who sent the buddy request
 * @param {number} requesteeId - the id of the student who received the buddy request
 *
 * @returns {object} the created buddy
 */
async function createBuddy(db, requestorId, requesteeId) {
    return await db.one(queries.buddies.createBuddy, [requestorId, requesteeId]);
}

/**
 * Creates a course
 *
 * @param {object} db - the database connection
 * @param {number} subjectId - the id of the subject of the course
 * @param {string} courseNumber - the course's number
 * @param {string} courseName - the course's name
 *
 * @returns {object} the created course
 */
async function createCourse(db, subjectId, courseNumber, courseName) {
    return await db.one(queries.courses.createCourse, [subjectId, courseNumber, courseName]);
}

/**
 * Creates an enrolment
 *
 * @param {object} db - the database connection
 * @param {number} studentId - the id of the student who is enrolled in the section
 * @param {number} sectionId - the id of the section the student is enrolled in
 *
 * @returns {object} the created enrolment
 */
async function createEnrolment(db, studentId, sectionId) {
    return await db.one(queries.enrolments.createEnrolment, [studentId, sectionId]);
}

/**
 * Creates an interest
 *
 * @param {object} db - the database connection
 * @param {number} studentId - the id of the student who likes the interest
 * @param {string} interestName - the interest's name
 *
 * @returns {object} the created interest
 */
async function createInterest(db, studentId, interestName) {
    return await db.one(queries.interests.createInterest, [studentId, interestName]);
}

/**
 * Creates a school
 *
 * @param {object} db - the database connection
 * @param {string} schoolName - the school's name
 * @param {string} currentTerm - the school's current term
 * @param {string} logoUrl - the school's logo url
 *
 * @returns {object} the created school
 */
async function createSchool(db, schoolName, currentTerm, logoUrl) {
    return await db.one(queries.schools.createSchool, [schoolName, currentTerm, logoUrl]);
}

/**
 * Creates a section
 *
 * @param {object} db - the database connection
 * @param {number} courseId - the id of the course of the section
 * @param {string} sectionNumber - the section's number
 * @param {string} sectionTerm - the section's term
 *
 * @returns {object} the created section
 */
async function createSection(db, courseId, sectionNumber, sectionTerm) {
    return await db.one(queries.sections.createSection, [courseId, sectionNumber, sectionTerm]);
}

/**
 * Creates a social media
 *
 * @param {object} db - the database connection
 * @param {number} studentId - the id of the Student that the social media belongs to
 * @param {string} socialMediaPlatform - the social media platform
 * @param {string} socialMediaUrl - the url of the student's profile on the platfor
 *
 * @returns {object} the created social media
 */
async function createSocialMedia(db, studentId, socialMediaName, socialMediaUrl) {
    return await db.one(queries.socialMedias.createSocialMedia, [studentId, socialMediaName, socialMediaUrl]);
}

/**
 * Creates a subject
 *
 * @param {object} db - the database connection
 * @param {number} schoolId - the id of the school where the subject is offered
 * @param {string} subjectName - the subject's name
 *
 * @returns {object} the created subject
 */
async function createSubject(db, schoolId, subjectName) {
    return await db.one(queries.subjects.createSubject, [schoolId, subjectName]);
}

/**
 * Creates a student
 *
 * @param {object} db - the database connection
 * @param {number} userId - the id of the user associated with the student
 * @param {number} schoolId - the id of the school the student attends
 * @param {string} firstName - the student's first name
 * @param {string} lastName - the student's last name
 * @param {string} year - the student's year of schooling
 * @param {string} faculty - the student's faculty
 * @param {string} major - the student's major
 * @param {string} profilePhotoUrl - the url of the student's profile photo
 * @param {string} bio - the student's bio
 *
 * @returns {object} the created student
 */
async function createStudent(db, userId, schoolId, firstName, lastName, year, faculty, major, profilePhotoUrl, bio) {
    return await db.one(queries.students.createStudent, [
        userId,
        schoolId,
        firstName,
        lastName,
        year,
        faculty,
        major,
        profilePhotoUrl,
        bio,
    ]);
}

/**
 * Creates a user
 *
 * @param {object} db - the database connection
 * @param {string} username - the user's username
 * @param {string} password - the user's password
 *
 * @returns {object} the created user
 */
async function createUser(db, username, password) {
    const salt = crypto.randomBytes(16);
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 1024, 32, "sha256");
    const token = jwt.sign({ username: username }, process.env.JWT_SECRET);

    return await db.one(queries.users.createUser, [username, hashedPassword, salt, token]);
}

/**
 * Deletes all data from the database
 *
 * @param {object} db - the database connection
 */
async function cleanUpDatabase(db) {
    await db.none(
        "TRUNCATE schools, subjects, courses, sections, users, students, enrolments, interests, social_medias, conversations, conversation_members, messages, buddies RESTART IDENTITY CASCADE"
    );
}

/**
 * Checks that a GET request to an endpoint returns the expected status code and body
 *
 * @param {object} app - the express app
 * @param {string} endpoint - the endpoint to send the GET request to
 * @param {string} token - the token to send with the GET request
 * @param {number} expectedStatusCode - the expected status code of the response
 * @param {any} expectedBody - the expected body of the response
 *
 * @returns {object} the response
 */
async function verifyGetRequestResponse(app, endpoint, token, expectedStatusCode, expectedBody) {
    const response = await request(app).get(endpoint).auth(token, { type: "bearer" });
    expect(response.statusCode).toEqual(expectedStatusCode);
    expect(response.body).toEqual(expectedBody);
    return response;
}

/**
 * Checks that a POST request to an endpoint that requires authentiation returns the expected status code and body
 *
 * @param {object} app - the express app
 * @param {string} endpoint - the endpoint to send the GET request to
 * @param {string} token - the token to send with the POST request
 * @param {any} payload - the payload to send with the POST request
 * @param {number} expectedStatusCode - the expected status code of the response
 * @param {any} expectedBody - the expected body of the response
 *
 * @returns {object} the response
 */
async function verifyPostRequestResponseWithAuth(app, endpoint, token, payload, expectedStatusCode, expectedBody) {
    const response = await request(app).post(endpoint).auth(token, { type: "bearer" }).send(payload);
    expect(response.statusCode).toEqual(expectedStatusCode);
    expect(response.body).toEqual(expectedBody);
    return response;
}

/**
 * Checks that a POST request to an endpoint returns the expected status code and body
 *
 * @param {object} app - the express app
 * @param {string} endpoint - the endpoint to send the GET request to
 * @param {any} payload - the payload to send with the POST request
 * @param {number} expectedStatusCode - the expected status code of the response
 * @param {any} expectedBody - the expected body of the response
 *
 * @returns {object} the response
 */
async function verifyPostRequestResponseWithoutAuth(app, endpoint, payload, expectedStatusCode, expectedBody) {
    const response = await request(app).post(endpoint).send(payload);
    expect(response.statusCode).toEqual(expectedStatusCode);
    expect(response.body).toEqual(expectedBody);
    return response;
}

module.exports = {
    createBuddy,
    createCourse,
    createEnrolment,
    createInterest,
    createSchool,
    createSection,
    createSocialMedia,
    createSubject,
    createStudent,
    createUser,
    cleanUpDatabase,
    verifyGetRequestResponse,
    verifyPostRequestResponseWithAuth,
    verifyPostRequestResponseWithoutAuth,
};
