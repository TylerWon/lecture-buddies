require("dotenv").config();

const request = require("supertest");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const app = require("../../src/app");
const db = require("../../src/configs/db.config");
const queries = require("../utils/queries");

describe("api tests", () => {
    let user1;
    let user2;
    let user3;
    let student1;
    let student2;
    let school;
    let subject1;
    let subject2;
    let course1;
    let course2;
    let course3;
    let section1;
    let section2;
    let section3;
    let enrolment1;
    let enrolment2;
    let enrolment3;
    let interest;
    let socialMedia;

    const user1Username = "won.tyler1@gmail.com";
    const user1Password = "password1";
    const user2Username = "won.tyler2@gmail.com";
    const user2Password = "password2";
    const user3Username = "won.tyler3@gmail.com";
    const user3Password = "password3";

    beforeAll(async () => {
        user1 = await createUser(user1Username, user1Password);
        user2 = await createUser(user2Username, user2Password);
        school = await createSchool("University of British Columbia", "www.ubc.ca/logo.png");
        subject1 = await createSubject(school.school_id, "CPSC");
        subject2 = await createSubject(school.school_id, "ENGL");
        course1 = await createCourse(subject1.subject_id, "110", "Computation, Programs, and Programming");
        course2 = await createCourse(subject1.subject_id, "121", "Models of Computation");
        course3 = await createCourse(subject2.subject_id, "110", "Approaches to Literature and Culture");
        section1 = await createSection(course1.course_id, "001", "2023W1");
        section2 = await createSection(course2.course_id, "001", "2023W1");
        section3 = await createSection(course3.course_id, "001", "2023W2");
        student1 = await createStudent(
            user1.user_id,
            school.school_id,
            "Tyler",
            "Won",
            "4",
            "Science",
            "Computer Science",
            "www.tylerwon.com/profile_photo.jpg",
            "Hello. I'm Tyler. I'm a 4th year computer science student at UBC."
        );
        interest = await createInterest(student1.student_id, "reading");
        socialMedia = await createSocialMedia(student1.student_id, "LinkedIn", "www.linkedin.com/tylerwon");
        enrolment1 = await createEnrolment(student1.student_id, section1.section_id);
        enrolment2 = await createEnrolment(student1.student_id, section2.section_id);
        enrolment3 = await createEnrolment(student1.student_id, section3.section_id);
    });

    afterAll(async () => {
        await db.none(queries.users.deleteUser, [user1.user_id]);
        await db.none(queries.users.deleteUser, [user2.user_id]);
        await db.none(queries.users.deleteUser, [user3.user_id]);
        await db.none(queries.schools.deleteSchool, [school.school_id]);
        await db.none(queries.subjects.deleteSubject, [subject1.subject_id]);
        await db.none(queries.subjects.deleteSubject, [subject2.subject_id]);
        await db.none(queries.courses.deleteCourse, [course1.course_id]);
        await db.none(queries.courses.deleteCourse, [course2.course_id]);
        await db.none(queries.courses.deleteCourse, [course3.course_id]);
        await db.none(queries.sections.deleteSection, [section1.section_id]);
        await db.none(queries.sections.deleteSection, [section2.section_id]);
        await db.none(queries.sections.deleteSection, [section3.section_id]);
        await db.none(queries.students.deleteStudent, [student1.student_id]);
        await db.none(queries.students.deleteStudent, [student2.student_id]);
        await db.none(queries.interests.deleteInterest, [interest.interest_id]);
        await db.none(queries.socialMedias.deleteSocialMedia, [socialMedia.social_media_id]);
        await db.none(queries.enrolments.deleteEnrolment, [enrolment1.student_id, enrolment1.section_id]);
        await db.none(queries.enrolments.deleteEnrolment, [enrolment2.student_id, enrolment2.section_id]);
        await db.none(queries.enrolments.deleteEnrolment, [enrolment3.student_id, enrolment3.section_id]);

        db.$pool.end();
    });

    /**
     * Creates a course
     *
     * @param {number} subjectId - the id of the subject of the course
     * @param {string} courseNumber - the course's number
     * @param {string} courseName - the course's name
     *
     * @returns {object} the created course
     */
    async function createCourse(subjectId, courseNumber, courseName) {
        return await db.one(queries.courses.createCourse, [subjectId, courseNumber, courseName]);
    }

    /**
     * Creates an enrolment
     *
     * @param {number} studentId - the id of the student who is enrolled in the section
     * @param {number} sectionId - the id of the section the student is enrolled in
     *
     * @returns {object} the created enrolment
     */
    async function createEnrolment(studentId, sectionId) {
        return await db.one(queries.enrolments.createEnrolment, [studentId, sectionId]);
    }

    /**
     * Creates an interest
     *
     * @param {number} studentId - the id of the student who likes the interest
     * @param {string} interestName - the interest's name
     *
     * @returns {object} the created interest
     */
    async function createInterest(studentId, interestName) {
        return await db.one(queries.interests.createInterest, [studentId, interestName]);
    }

    /**
     * Creates a school
     *
     * @param {string} schoolName - the school's name
     * @param {string} logoUrl - the school's logo url
     *
     * @returns {object} the created school
     */
    async function createSchool(schoolName, logoUrl) {
        return await db.one(queries.schools.createSchool, [schoolName, logoUrl]);
    }

    /**
     * Creates a section
     *
     * @param {number} courseId - the id of the course of the section
     * @param {string} sectionNumber - the section's number
     * @param {string} sectionTerm - the section's term
     *
     * @returns {object} the created section
     */
    async function createSection(courseId, sectionNumber, sectionTerm) {
        return await db.one(queries.sections.createSection, [courseId, sectionNumber, sectionTerm]);
    }

    /**
     * Creates a social media
     *
     * @param {number} studentId - the id of the Student that the social media belongs to
     * @param {string} socialMediaPlatform - the social media platform
     * @param {string} socialMediaUrl - the url of the student's profile on the platfor
     *
     * @returns {object} the created social media
     */
    async function createSocialMedia(studentId, socialMediaName, socialMediaUrl) {
        return await db.one(queries.socialMedias.createSocialMedia, [studentId, socialMediaName, socialMediaUrl]);
    }

    /**
     * Creates a subject
     *
     * @param {number} schoolId - the id of the school where the subject is offered
     * @param {string} subjectName - the subject's name
     *
     * @returns {object} the created subject
     */
    async function createSubject(schoolId, subjectName) {
        return await db.one(queries.subjects.createSubject, [schoolId, subjectName]);
    }

    /**
     * Creates a student
     *
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
    async function createStudent(userId, schoolId, firstName, lastName, year, faculty, major, profilePhotoUrl, bio) {
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
     * @param {string} username - the user's username
     * @param {string} password - the user's password
     *
     * @returns {object} the created user
     */
    async function createUser(username, password) {
        const salt = crypto.randomBytes(16);
        const hashedPassword = crypto.pbkdf2Sync(password, salt, 1024, 32, "sha256");
        const token = jwt.sign({ username: username }, process.env.JWT_SECRET);

        return await db.one(queries.users.createUser, [username, hashedPassword, salt, token]);
    }

    /**
     * Checks that a GET request to an endpoint returns the expected status code and body
     *
     * @param {string} endpoint - the endpoint to send the GET request to
     * @param {string} token - the token to send with the GET request
     * @param {number} expectedStatusCode - the expected status code of the response
     * @param {any} expectedBody - the expected body of the response
     *
     * @returns {object} the response
     */
    async function verifyGetRequestResponse(endpoint, token, expectedStatusCode, expectedBody) {
        const response = await request(app).get(endpoint).auth(token, { type: "bearer" });
        expect(response.statusCode).toEqual(expectedStatusCode);
        console.log(response.body);
        expect(response.body).toEqual(expectedBody);
        return response;
    }

    /**
     * Checks that a POST request to an endpoint that requires authentiation returns the expected status code and body
     *
     * @param {string} endpoint - the endpoint to send the GET request to
     * @param {string} token - the token to send with the POST request
     * @param {any} payload - the payload to send with the POST request
     * @param {number} expectedStatusCode - the expected status code of the response
     * @param {any} expectedBody - the expected body of the response
     *
     * @returns {object} the response
     */
    async function verifyPostRequestResponseWithAuth(endpoint, token, payload, expectedStatusCode, expectedBody) {
        const response = await request(app).post(endpoint).auth(token, { type: "bearer" }).send(payload);
        expect(response.statusCode).toEqual(expectedStatusCode);
        expect(response.body).toEqual(expectedBody);
        return response;
    }

    /**
     * Checks that a POST request to an endpoint returns the expected status code and body
     *
     * @param {string} endpoint - the endpoint to send the GET request to
     * @param {any} payload - the payload to send with the POST request
     * @param {number} expectedStatusCode - the expected status code of the response
     * @param {any} expectedBody - the expected body of the response
     *
     * @returns {object} the response
     */
    async function verifyPostRequestResponseWithoutAuth(endpoint, payload, expectedStatusCode, expectedBody) {
        const response = await request(app).post(endpoint).send(payload);
        expect(response.statusCode).toEqual(expectedStatusCode);
        expect(response.body).toEqual(expectedBody);
        return response;
    }

    describe("auth routes tests", () => {
        describe("/auth/login", () => {
            let payload;

            beforeEach(() => {
                payload = {
                    username: user1Username,
                    password: user1Password,
                };
            });

            test("POST - should log a user in", async () => {
                verifyPostRequestResponseWithoutAuth("/auth/login", payload, 200, {
                    user_id: user1.user_id,
                    token: user1.token,
                });
            });

            test("POST - should not log a user in when missing some fields", async () => {
                delete payload.username;

                await verifyPostRequestResponseWithoutAuth("/auth/login", payload, 400, [
                    {
                        type: "field",
                        location: "body",
                        path: "username",
                        msg: "username is required",
                    },
                ]);
            });

            test("POST - should not log a user in when some fields are the wrong type", async () => {
                payload.password = 12345678;

                await verifyPostRequestResponseWithoutAuth("/auth/login", payload, 400, [
                    {
                        type: "field",
                        location: "body",
                        path: "password",
                        value: payload.password,
                        msg: "password must be a string",
                    },
                ]);
            });

            test("POST - should not log a user in when username is incorrect", async () => {
                payload.username = "test@test.com";

                const response = await request(app).post("/auth/login").send(payload);
                expect(response.statusCode).toEqual(401);
                expect(response.text).toEqual("Unauthorized");
            });

            test("POST - should not log a user in when password is incorrect", async () => {
                payload.password = "abcdef";

                const response = await request(app).post("/auth/login").send(payload);
                expect(response.statusCode).toEqual(401);
                expect(response.text).toEqual("Unauthorized");
            });
        });

        describe("/auth/logout", () => {
            test("POST - should log a user out", async () => {
                await verifyPostRequestResponseWithAuth("/auth/logout", user1.token, undefined, 200, {
                    message: "logout successful",
                });
            });

            test("POST - should not log a user out when request is unauthenticated", async () => {
                await verifyPostRequestResponseWithAuth("/auth/logout", undefined, undefined, 401, {
                    message: "unauthorized",
                });
            });
        });

        describe("/auth/signup", () => {
            let payload;

            beforeEach(() => {
                payload = { username: user3Username, password: user3Password };
            });

            test("POST - should sign a user up", async () => {
                let response = await request(app).post("/auth/signup").send(payload);
                expect(response.statusCode).toEqual(200);

                response = await request(app).post("/auth/login").send(payload);
                expect(response.statusCode).toEqual(200);

                user3 = response.body;
            });

            test("POST - should not sign a user up when missing some fields", async () => {
                delete payload.username;

                await verifyPostRequestResponseWithoutAuth("/auth/signup", payload, 400, [
                    {
                        type: "field",
                        location: "body",
                        path: "username",
                        msg: "username is required",
                    },
                ]);
            });

            test("POST - should not sign a user up when some fields are the wrong type", async () => {
                payload.password = 12345678;

                await verifyPostRequestResponseWithoutAuth("/auth/signup", payload, 400, [
                    {
                        type: "field",
                        location: "body",
                        path: "password",
                        value: payload.password,
                        msg: "password must be a string",
                    },
                ]);
            });

            test("POST - should not sign a user up when username is already in use", async () => {
                payload.username = user1Username;
                payload.password = user1Password;

                const response = await request(app).post("/auth/signup").send(payload);
                expect(response.statusCode).toEqual(400);
                expect(response.body).toEqual({ message: "an account with that username already exists" });
            });
        });
    });

    describe("course routes tests", () => {
        describe("/courses/{course_id}/sections", () => {
            test("GET - should return the sections for a course", async () => {
                await verifyGetRequestResponse(`/courses/${course1.course_id}/sections`, user1.token, 200, [section1]);
            });

            test("GET - should return nothing when course_id does not correspond to a course", async () => {
                await verifyGetRequestResponse(`/courses/${course1.course_id + 100}/sections`, user1.token, 200, []);
            });

            test("GET - should return error message when request is unauthenticated", async () => {
                await verifyGetRequestResponse(`/courses/${course1.course_id}/sections`, undefined, 401, {
                    message: "unauthorized",
                });
            });
        });
    });

    describe("school routes tests", () => {
        describe("/schools", () => {
            test("GET - should return all schools", async () => {
                await verifyGetRequestResponse("/schools", user1.token, 200, [school]);
            });

            test("GET - should return error message when request is unauthenticated", async () => {
                await verifyGetRequestResponse("/schools", undefined, 401, {
                    message: "unauthorized",
                });
            });
        });

        describe("/schools/{school_id}/subjects", () => {
            test("GET - should return the subjects for a school", async () => {
                await verifyGetRequestResponse(`/schools/${school.school_id}/subjects`, user1.token, 200, [
                    subject1,
                    subject2,
                ]);
            });

            test("GET - should return nothing when school_id does not correspond to a school", async () => {
                await verifyGetRequestResponse(`/schools/${school.school_id + 100}/subjects`, user1.token, 200, []);
            });

            test("GET - should return error message when request is unauthenticated", async () => {
                await verifyGetRequestResponse(`/schools/${school.school_id}/subjects`, undefined, 401, {
                    message: "unauthorized",
                });
            });
        });
    });

    describe("subject routes tests", () => {
        describe("/subjects/{subject_id}/courses", () => {
            test("GET - should return the courses for a subject", async () => {
                await verifyGetRequestResponse(`/subjects/${subject1.subject_id}/courses`, user1.token, 200, [
                    course1,
                    course2,
                ]);
            });

            test("GET - should return nothing when subject_id does not correspond to a subject", async () => {
                await verifyGetRequestResponse(`/subjects/100/courses`, user1.token, 200, []);
            });

            test("GET - should return error message when request is unauthenticated", async () => {
                await verifyGetRequestResponse(`/subjects/${subject1.subject_id}/courses`, undefined, 401, {
                    message: "unauthorized",
                });
            });
        });
    });

    describe("student routes tests", () => {
        describe("/students", () => {
            let payload;

            beforeEach(() => {
                payload = {
                    student_id: user2.user_id,
                    school_id: school.school_id,
                    first_name: "Connor",
                    last_name: "Won",
                    year: "3",
                    faculty: "Science",
                    major: "Computer Science",
                    profile_photo_url: "www.connorwon.com/profile_photo.jpg",
                    bio: "Hello. I'm Connor. I'm a 3rd year computer science student at UBC.",
                };
            });

            test("POST - should create a student", async () => {
                const response = await verifyPostRequestResponseWithAuth(
                    "/students",
                    user1.token,
                    payload,
                    201,
                    payload
                );
                student2 = response.body;
            });

            test("POST - should not create a student when missing some fields", async () => {
                delete payload.last_name;
                delete payload.profile_photo_url;

                await verifyPostRequestResponseWithAuth("/students", user1.token, payload, 400, [
                    {
                        type: "field",
                        location: "body",
                        path: "last_name",
                        msg: "last_name is required",
                    },
                    {
                        type: "field",
                        location: "body",
                        path: "profile_photo_url",
                        msg: "profile_photo_url is required",
                    },
                ]);
            });

            test("POST - should not create a student when some fields are the wrong type", async () => {
                payload.first_name = true;
                payload.year = 4;

                await verifyPostRequestResponseWithAuth("/students", user1.token, payload, 400, [
                    {
                        type: "field",
                        location: "body",
                        path: "first_name",
                        value: payload.first_name,
                        msg: "first_name must be a string",
                    },
                    {
                        type: "field",
                        location: "body",
                        path: "year",
                        value: payload.year,
                        msg: "year must be a string",
                    },
                ]);
            });

            test("POST - should not create a student when user does not exist", async () => {
                payload.student_id = user2.user_id + 100;

                await verifyPostRequestResponseWithAuth("/students", user1.token, payload, 400, {
                    message: `user with id '${payload.student_id}' does not exist`,
                });
            });

            test("POST - should not create a student when school does not exist", async () => {
                payload.school_id = school.school_id + 100;

                await verifyPostRequestResponseWithAuth("/students", user1.token, payload, 400, {
                    message: `school with id '${payload.school_id}' does not exist`,
                });
            });

            test("POST - should not create a student when request is unauthenticated", async () => {
                await verifyPostRequestResponseWithAuth("/students", undefined, payload, 401, {
                    message: "unauthorized",
                });
            });
        });

        describe("/students/{student_id}", () => {
            test("GET - should return a student", async () => {
                await verifyGetRequestResponse(`/students/${student1.student_id}`, user1.token, 200, student1);
            });

            test("GET - should return nothing when student_id does not correspond to a student", async () => {
                await verifyGetRequestResponse(`/students/${student1.student_id + 100}`, user1.token, 200, null);
            });

            test("GET - should return error message when request is unauthenticated", async () => {
                await verifyGetRequestResponse(`/students/${student1.student_id}`, undefined, 401, {
                    message: "unauthorized",
                });
            });
        });

        describe("/students/{student_id}/interests", () => {
            test("GET - should return the interests for a student", async () => {
                await verifyGetRequestResponse(`/students/${student1.student_id}/interests`, user1.token, 200, [
                    interest,
                ]);
            });

            test("GET - should return nothing when student_id does not correspond to a student", async () => {
                await verifyGetRequestResponse(
                    `/students/${student1.student_id + 100}/interests`,
                    user1.token,
                    200,
                    []
                );
            });

            test("GET - should return error message when request is unauthenticated", async () => {
                await verifyGetRequestResponse(`/students/${student1.student_id}/interests`, undefined, 401, {
                    message: "unauthorized",
                });
            });
        });

        describe("/students/{student_id}/social-medias", () => {
            test("GET - should return the social medias for a student", async () => {
                await verifyGetRequestResponse(`/students/${student1.student_id}/social-medias`, user1.token, 200, [
                    socialMedia,
                ]);
            });

            test("GET - should return nothing when student_id does not correspond to a student", async () => {
                await verifyGetRequestResponse(
                    `/students/${student1.student_id + 100}/social-medias`,
                    user1.token,
                    200,
                    []
                );
            });

            test("GET - should return error message when request is unauthenticated", async () => {
                await verifyGetRequestResponse(`/students/${student1.student_id}/social-medias`, undefined, 401, {
                    message: "unauthorized",
                });
            });
        });

        describe("/students/{student_id}/course-history", () => {
            test("GET - should return the course history for a student (order by -name)", async () => {
                await verifyGetRequestResponse(
                    `/students/${student1.student_id}/course-history?order_by=-name`,
                    user1.token,
                    200,
                    [
                        {
                            student_id: student1.student_id,
                            school_id: school.school_id,
                            subject_id: subject1.subject_id,
                            subject_name: subject1.subject_name,
                            course_id: course1.course_id,
                            course_number: course1.course_number,
                            course_name: course1.course_name,
                            section_id: section1.section_id,
                            section_number: section1.section_number,
                            section_term: section1.section_term,
                        },
                        {
                            student_id: student1.student_id,
                            school_id: school.school_id,
                            subject_id: subject1.subject_id,
                            subject_name: subject1.subject_name,
                            course_id: course2.course_id,
                            course_number: course2.course_number,
                            course_name: course2.course_name,
                            section_id: section2.section_id,
                            section_number: section2.section_number,
                            section_term: section2.section_term,
                        },
                        {
                            student_id: student1.student_id,
                            school_id: school.school_id,
                            subject_id: subject2.subject_id,
                            subject_name: subject2.subject_name,
                            course_id: course3.course_id,
                            course_number: course3.course_number,
                            course_name: course3.course_name,
                            section_id: section3.section_id,
                            section_number: section3.section_number,
                            section_term: section3.section_term,
                        },
                    ]
                );
            });

            test("GET - should return nothing when student_id does not correspond to a student", async () => {
                await verifyGetRequestResponse(
                    `/students/${student1.student_id + 100}/course-history?order_by=-name`,
                    user1.token,
                    200,
                    []
                );
            });

            test("GET - should return error message when missing a query parameter", async () => {
                await verifyGetRequestResponse(
                    `/students/${student1.student_id + 100}/course-history?order_by=-name`,
                    user1.token,
                    200,
                    [
                        {
                            type: "field",
                            location: "query",
                            path: "order_by",
                            msg: "order_by is required",
                        },
                    ]
                );
            });

            test("GET - should return error message when a query parameter value is not a valid option", async () => {
                const orderBy = "-term";

                await verifyGetRequestResponse(
                    `/students/${student1.student_id + 100}/course-history?order_by=${orderBy}`,
                    user1.token,
                    200,
                    [
                        {
                            type: "field",
                            location: "query",
                            path: "order_by",
                            value: orderBy,
                            msg: "order_by must be one of -name, +name",
                        },
                    ]
                );
            });

            test("GET - should return error message when request is unauthenticated", async () => {
                await verifyGetRequestResponse(
                    `/students/${student1.student_id}/course-history?order_by=-name`,
                    user1.token,
                    401,
                    {
                        message: "unauthorized",
                    }
                );
            });
        });
    });
});
