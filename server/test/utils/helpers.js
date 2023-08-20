require("dotenv").config();

const crypto = require("crypto");

const queries = require("../utils/queries");

/**
 * Deletes all data from the database
 *
 * @param {object} db - the database connection
 */
const cleanUpDatabase = async (db) => {
    await db.none(
        "TRUNCATE schools, subjects, courses, sections, users, students, enrolments, interests, social_medias, conversations, messages, friendships RESTART IDENTITY CASCADE"
    );
};

/**
 * Creates a friendship
 *
 * @param {object} db - the database connection
 * @param {number} requestorId - the ID of the student that is requesting to be the other student’s friend
 * @param {number} requesteeId -  the ID of the student that is receiving the request to be the other student’s friend
 * @param {string} friendshipStatus - the status of the friendship
 *
 * @returns {object} the created friendship
 */
const createFriendship = async (db, requestorId, requesteeId, friendshipStatus) => {
    return await db.one(queries.friendships.createFriendship, [requestorId, requesteeId, friendshipStatus]);
};

/**
 * Creates a conversation
 *
 * @param {object} db - the database connection
 * @param {number} studentId1 - the ID of the first student in the conversation
 * @param {number} studentId2 - the ID of the second student in the conversation
 *
 * @returns {object} the created conversation
 */
const createConversation = async (db, studentId1, studentId2) => {
    return await db.one(queries.conversations.createConversation, [studentId1, studentId2]);
};

/**
 * Creates a course
 *
 * @param {object} db - the database connection
 * @param {number} subjectId - the ID of the subject of the course
 * @param {string} courseNumber - the course's number
 * @param {string} courseName - the course's name
 *
 * @returns {object} the created course
 */
const createCourse = async (db, subjectId, courseNumber, courseName) => {
    return await db.one(queries.courses.createCourse, [subjectId, courseNumber, courseName]);
};

/**
 * Creates an enrolment (i.e enrol a student in a section)
 *
 * @param {object} db - the database connection
 * @param {number} studentId - the ID of the student who is enrolled in the section
 * @param {number} sectionId - the ID of the section the student is enrolled in
 *
 * @returns {object} the created enrolment
 */
const createEnrolment = async (db, studentId, sectionId) => {
    return await db.one(queries.enrolments.createEnrolment, [studentId, sectionId]);
};

/**
 * Creates an interest
 *
 * @param {object} db - the database connection
 * @param {number} studentId - the ID of the student who likes the interest
 * @param {string} interestName - the interest's name
 *
 * @returns {object} the created interest
 */
const createInterest = async (db, studentId, interestName) => {
    return await db.one(queries.interests.createInterest, [studentId, interestName]);
};

/**
 * Creates a message
 *
 * @param {object} db - the database connection
 * @param {number} conversationId - the ID of the conversation the message belongs to
 * @param {number} authorId - the ID of the student who sent the message
 * @param {string} messageContent - the message's content
 *
 * @returns {object} the created message
 */
const createMessage = async (db, conversationId, authorId, messageContent) => {
    return await db.one(queries.messages.createMessage, [conversationId, authorId, messageContent]);
};

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
const createSchool = async (db, schoolName, currentTerm, logoUrl) => {
    return await db.one(queries.schools.createSchool, [schoolName, currentTerm, logoUrl]);
};

/**
 * Creates a section
 *
 * @param {object} db - the database connection
 * @param {number} courseId - the ID of the course of the section
 * @param {string} sectionNumber - the section's number
 * @param {string} sectionTerm - the section's term
 *
 * @returns {object} the created section
 */
const createSection = async (db, courseId, sectionNumber, sectionTerm) => {
    return await db.one(queries.sections.createSection, [courseId, sectionNumber, sectionTerm]);
};

/**
 * Creates a social media
 *
 * @param {object} db - the database connection
 * @param {number} studentId - the ID of the Student that the social media belongs to
 * @param {string} socialMediaPlatform - the social media platform
 * @param {string} socialMediaUrl - the url of the student's profile on the platfor
 *
 * @returns {object} the created social media
 */
const createSocialMedia = async (db, studentId, socialMediaName, socialMediaUrl) => {
    return await db.one(queries.socialMedias.createSocialMedia, [studentId, socialMediaName, socialMediaUrl]);
};

/**
 * Creates a subject
 *
 * @param {object} db - the database connection
 * @param {number} schoolId - the ID of the school where the subject is offered
 * @param {string} subjectName - the subject's name
 *
 * @returns {object} the created subject
 */
const createSubject = async (db, schoolId, subjectName) => {
    return await db.one(queries.subjects.createSubject, [schoolId, subjectName]);
};

/**
 * Creates a student
 *
 * @param {object} db - the database connection
 * @param {number} userId - the ID of the user associated with the student
 * @param {number} schoolId - the ID of the school the student attends
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
const createStudent = async (db, userId, schoolId, firstName, lastName, year, faculty, major, profilePhotoUrl, bio) => {
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
};

/**
 * Creates a user
 *
 * @param {object} db - the database connection
 * @param {string} username - the user's username
 * @param {string} password - the user's password
 *
 * @returns {object} the created user
 */
const createUser = async (db, username, password) => {
    const salt = crypto.randomBytes(16);
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 1024, 32, "sha256");

    return await db.one(queries.users.createUser, [username, hashedPassword, salt]);
};

/**
 * Signs a user up
 *
 * @param {object} app - a supertest request
 * @param {string} username - the user's username
 * @param {string} password - the user's password
 */
const signUpUser = async (request, username, password) => {
    const response = await request.post("/auth/signUp").send({ username: username, password: password });
    return response.body;
};

/**
 * Updates a friendship
 *
 * @param {object} db - the database connection
 * @param {number} requestorId - the ID of the student that is requesting to be the other student’s friend
 * @param {number} requesteeId -  the ID of the student that is receiving the request to be the other student’s friend
 * @param {string} friendshipStatus - the status of the friendship
 *
 * @returns {object} the updated friendship
 */
const updateFriendship = async (db, requestor_id, requestee_id, friendshipStatus) => {
    return await db.one(queries.friendships.updateFriendship, [friendshipStatus, requestor_id, requestee_id]);
};

/**
 * Updates a student
 *
 * @param {object} db - the database connection
 * @param {number} studentId - The student's ID
 * @param {number} schoolId - the ID of the new school the student attends
 * @param {string} firstName - the student's new first name
 * @param {string} lastName - the student's new last name
 * @param {string} year - the student's new year of schooling
 * @param {string} faculty - the student's new faculty
 * @param {string} major - the student's new major
 * @param {string} profilePhotoUrl - the new url of the student's profile photo
 * @param {string} bio - the student's new bio
 *
 * @returns {object} the updated student
 */
const updateStudent = async (
    db,
    studentId,
    schoolId,
    firstName,
    lastName,
    year,
    faculty,
    major,
    profilePhotoUrl,
    bio
) => {
    return await db.one(queries.students.updateStudent, [
        schoolId,
        firstName,
        lastName,
        year,
        faculty,
        major,
        profilePhotoUrl,
        bio,
        studentId,
    ]);
};

/**
 * Checks that a DELETE request to an endpoint returns the expected status code and body
 *
 * @param {object} request - a supertest request
 * @param {string} endpoint - the endpoint to send the DELETE request to
 * @param {string} accessToken - the access token to send with the DELETE request
 * @param {number} expectedStatusCode - the expected status code of the response
 * @param {any} expectedBody - the expected body of the response
 *
 * @returns {object} the response
 */
const verifyDeleteRequestResponse = async (request, endpoint, expectedStatusCode, expectedBody) => {
    const response = await request.delete(endpoint);
    expect(response.statusCode).toEqual(expectedStatusCode);
    expect(response.body).toEqual(expectedBody);
};

/**
 * Checks that a GET request to an endpoint returns the expected status code and body
 *
 * @param {object} request - a supertest request
 * @param {string} endpoint - the endpoint to send the GET request to
 * @param {number} expectedStatusCode - the expected status code of the response
 * @param {any} expectedBody - the expected body of the response
 *
 * @returns {object} the response
 */
const verifyGetRequestResponse = async (request, endpoint, expectedStatusCode, expectedBody) => {
    const response = await request.get(endpoint);
    expect(response.statusCode).toEqual(expectedStatusCode);
    expect(response.body).toEqual(expectedBody);
};

/**
 * Checks that a PATCH request to an endpoint returns the expected status code and body
 *
 * @param {object} request - a supertest request
 * @param {string} endpoint - the endpoint to send the PATCH request to
 * @param {any} payload - the payload to send with the PATCH request
 * @param {number} expectedStatusCode - the expected status code of the response
 * @param {any} expectedBody - the expected body of the response
 *
 * @returns {object} the response
 */
const verifyPatchRequestResponse = async (request, endpoint, payload, expectedStatusCode, expectedBody) => {
    const response = await request.patch(endpoint).send(payload);
    expect(response.statusCode).toEqual(expectedStatusCode);
    expect(response.body).toEqual(expectedBody);
};

/**
 * Checks that a POST request to an endpoint returns the expected status code and body
 *
 * @param {object} request - a supertest request
 * @param {string} endpoint - the endpoint to send the POST request to
 * @param {any} payload - the payload to send with the POST request
 * @param {number} expectedStatusCode - the expected status code of the response
 * @param {any} expectedBody - the expected body of the response
 *
 * @returns {object} the response
 */
const verifyPostRequestResponse = async (request, endpoint, payload, expectedStatusCode, expectedBody) => {
    const response = await request.post(endpoint).send(payload);
    expect(response.statusCode).toEqual(expectedStatusCode);
    expect(response.body).toEqual(expectedBody);
};

/**
 * Checks that a PUT request to an endpoint returns the expected status code and body
 *
 * @param {object} request - a supertest request
 * @param {string} endpoint - the endpoint to send the PUT request to
 * @param {any} payload - the payload to send with the PUT request
 * @param {number} expectedStatusCode - the expected status code of the response
 * @param {any} expectedBody - the expected body of the response
 *
 * @returns {object} the response
 */
const verifyPutRequestResponse = async (request, endpoint, payload, expectedStatusCode, expectedBody) => {
    const response = await request.put(endpoint).send(payload);
    expect(response.statusCode).toEqual(expectedStatusCode);
    expect(response.body).toEqual(expectedBody);
};

module.exports = {
    cleanUpDatabase,
    createFriendship,
    createCourse,
    createConversation,
    createEnrolment,
    createInterest,
    createMessage,
    createSchool,
    createSection,
    createSocialMedia,
    createSubject,
    createStudent,
    createUser,
    signUpUser,
    updateFriendship,
    updateStudent,
    verifyDeleteRequestResponse,
    verifyGetRequestResponse,
    verifyPatchRequestResponse,
    verifyPostRequestResponse,
    verifyPutRequestResponse,
};
