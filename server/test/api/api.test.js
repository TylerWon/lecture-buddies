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
    let student;
    let school;
    let subject;
    let course;
    let section;

    const user1Username = "won.tyler1@gmail.com";
    const user1Password = "password1";
    const user2Username = "won.tyler2@gmail.com";
    const user2Password = "password2";

    beforeAll(async () => {
        user1 = await createUser(user1Username, user1Password);
        school = await db.one(queries.schools.createSchool, ["University of British Columbia", "www.ubc.ca/logo.png"]);
        subject = await db.one(queries.subjects.createSubject, [school.school_id, "CPSC"]);
        course = await db.one(queries.courses.createCourse, [
            subject.subject_id,
            "110",
            "Computation, Programs, and Programming",
        ]);
        section = await db.one(queries.sections.createSection, [course.course_id, "001", "2023W1"]);
    });

    afterAll(async () => {
        await db.none(queries.users.deleteUser, [user1.user_id]);
        await db.none(queries.users.deleteUser, [user2.user_id]);
        await db.none(queries.schools.deleteSchool, [school.school_id]);
        await db.none(queries.subjects.deleteSubject, [subject.subject_id]);
        await db.none(queries.courses.deleteCourse, [course.course_id]);
        await db.none(queries.sections.deleteSection, [section.section_id]);
        await db.none(queries.students.deleteStudent, [student.student_id]);

        db.$pool.end();
    });

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
     */
    async function verifyGetRequestResponse(endpoint, token, expectedStatusCode, expectedBody) {
        const response = await request(app).get(endpoint).auth(token, { type: "bearer" });
        expect(response.statusCode).toEqual(expectedStatusCode);
        expect(response.body).toEqual(expectedBody);
    }

    /**
     * Checks that a POST request to an endpoint that requires authentiation returns the expected status code and body
     *
     * @param {string} endpoint - the endpoint to send the GET request to
     * @param {string} token - the token to send with the POST request
     * @param {any} payload - the payload to send with the POST request
     * @param {number} expectedStatusCode - the expected status code of the response
     * @param {any} expectedBody - the expected body of the response
     */
    async function verifyPostRequestResponseWithAuth(endpoint, token, payload, expectedStatusCode, expectedBody) {
        const response = await request(app).post(endpoint).auth(token, { type: "bearer" }).send(payload);
        expect(response.statusCode).toEqual(expectedStatusCode);
        expect(response.body).toEqual(expectedBody);
    }

    /**
     * Checks that a POST request to an endpoint returns the expected status code and body
     *
     * @param {string} endpoint - the endpoint to send the GET request to
     * @param {any} payload - the payload to send with the POST request
     * @param {number} expectedStatusCode - the expected status code of the response
     * @param {any} expectedBody - the expected body of the response
     */
    async function verifyPostRequestResponseWithoutAuth(endpoint, payload, expectedStatusCode, expectedBody) {
        const response = await request(app).post(endpoint).send(payload);
        expect(response.statusCode).toEqual(expectedStatusCode);
        expect(response.body).toEqual(expectedBody);
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

            test("POST - should log a user in when username and password are correct", async () => {
                verifyPostRequestResponseWithoutAuth("/auth/login", payload, 200, {
                    user_id: user1.user_id,
                    token: user1.token,
                });
            });

            test("POST - should not log a user in when missing some fields", async () => {
                delete payload.username;

                verifyPostRequestResponseWithoutAuth("/auth/login", payload, 400, {
                    errors: [
                        {
                            type: "field",
                            location: "body",
                            path: "username",
                            message: "username is a required field",
                        },
                    ],
                });
            });

            test("POST - should not log a user in when some fields are the wrong type", async () => {
                payload.password = 12345678;

                verifyPostRequestResponseWithoutAuth("/auth/login", payload, 400, {
                    errors: [
                        {
                            type: "field",
                            location: "body",
                            path: "password",
                            value: payload.password,
                            message: "password must be a string",
                        },
                    ],
                });
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
                payload = { username: user2Username, password: user2Password };
            });

            test("POST - should sign a user up when username is not already in use", async () => {
                let response = await request(app).post("/auth/signup").send(payload);
                expect(response.statusCode).toEqual(200);

                response = await request(app).post("/auth/login").send(payload);
                expect(response.statusCode).toEqual(200);

                user2 = response.body;
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
                await verifyGetRequestResponse(`/courses/${course.course_id}/sections`, user1.token, 200, [
                    {
                        section_id: section.section_id,
                        course_id: course.course_id,
                        section_number: section.section_number,
                        section_term: section.section_term,
                    },
                ]);
            });

            test("GET - should return nothing when course_id is invalid", async () => {
                await verifyGetRequestResponse(`/courses/100/sections`, user1.token, 200, []);
            });

            test("GET - should return nothing when request is unauthenticated", async () => {
                await verifyGetRequestResponse(`/courses/${course.course_id}/sections`, undefined, 401, {
                    message: "unauthorized",
                });
            });
        });
    });

    describe("school routes tests", () => {
        describe("/schools", () => {
            test("GET - should return all schools", async () => {
                await verifyGetRequestResponse("/schools", user1.token, 200, [
                    {
                        school_id: school.school_id,
                        school_name: school.school_name,
                        logo_url: school.logo_url,
                    },
                ]);
            });

            test("GET - should return nothing when request is unauthenticated", async () => {
                await verifyGetRequestResponse("/schools", undefined, 401, {
                    message: "unauthorized",
                });
            });
        });

        describe("/schools/{school_id}/subjects", () => {
            test("GET - should return the subjects for a school", async () => {
                await verifyGetRequestResponse(`/schools/${school.school_id}/subjects`, user1.token, 200, [
                    {
                        subject_id: subject.subject_id,
                        school_id: subject.school_id,
                        subject_name: subject.subject_name,
                    },
                ]);
            });

            test("GET - should return nothing when school_id is invalid", async () => {
                await verifyGetRequestResponse(`/schools/100/subjects`, user1.token, 200, []);
            });

            test("GET - should return nothing when request is unauthenticated", async () => {
                await verifyGetRequestResponse(`/schools/${school.school_id}/subjects`, undefined, 401, {
                    message: "unauthorized",
                });
            });
        });
    });

    describe("subject routes tests", () => {
        describe("/subjects/{subject_id}/courses", () => {
            test("GET - should return the courses for a subject", async () => {
                await verifyGetRequestResponse(`/subjects/${subject.subject_id}/courses`, user1.token, 200, [
                    {
                        course_id: course.course_id,
                        subject_id: course.subject_id,
                        course_number: course.course_number,
                        course_name: course.course_name,
                    },
                ]);
            });

            test("GET - should return nothing when subject_id is invalid", async () => {
                await verifyGetRequestResponse(`/subjects/100/courses`, user1.token, 200, []);
            });

            test("GET - should return nothing when request is unauthenticated", async () => {
                await verifyGetRequestResponse(`/subjects/${subject.subject_id}/courses`, undefined, 401, {
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
                    student_id: user1.user_id,
                    first_name: "Tyler",
                    last_name: "Won",
                    school: school.school_id,
                    year: "4",
                    faculty: "Science",
                    major: "Computer Science",
                    bio: "Hello. I'm Tyler. I'm a 4th year computer science student at UBC.",
                    profile_photo_url: "www.tylerwon.com/profile_photo.jpg",
                    interests: [
                        {
                            interest_name: "reading",
                        },
                    ],
                    social_medias: [
                        {
                            platform: "LinkedIn",
                            url: "www.linkedin.com/in/tyler-won/",
                        },
                    ],
                    sections: [section.section_id],
                };
            });

            test("POST - should create a student", async () => {
                let response = await request(app).post("/students").auth(user1.token, { type: "bearer" }).send(payload);
                student = response.body;
                expect(response.statusCode).toEqual(201);
                expect(student.student_id).toEqual(payload.user_id);
                expect(student.first_name).toEqual(payload.first_name);
                expect(student.last_name).toEqual(payload.last_name);
                expect(student.school).toEqual(payload.school);
                expect(student.year).toEqual(payload.year);
                expect(student.faculty).toEqual(payload.faculty);
                expect(student.major).toEqual(payload.major);
                expect(student.bio).toEqual(payload.bio);
                expect(student.profile_photo_url).toEqual(payload.profile_photo_url);

                response = await request(app)
                    .get(`/students/${user1.user_id}/interests`)
                    .auth(user1.token, { type: "bearer" });
                const interests = response.body;
                expect(response.statusCode).toEqual(200);
                expect(interests[0].interest_name).toEqual(payload.interests[0].interest_name);

                response = await request(app)
                    .get(`/students/${user1.user_id}/social-medias`)
                    .auth(user1.token, { type: "bearer" });
                const socialMedias = response.body;
                expect(response.statusCode).toEqual(200);
                expect(socialMedias[0].platform).toEqual(payload.social_medias[0].platform);
                expect(socialMedias[0].url).toEqual(payload.social_medias[0].url);
            });

            test("POST - should not create a student when missing some student fields", async () => {
                delete payload.last_name;
                delete payload.profile_photo_url;

                await verifyPostRequestResponseWithAuth("/students", user1.token, payload, 400, {
                    errors: [
                        {
                            type: "field",
                            location: "body",
                            path: "last_name",
                            message: "last_name is a required field",
                        },
                        {
                            type: "field",
                            location: "body",
                            path: "profile_photo_url",
                            message: "profile_photo_url is a required field",
                        },
                    ],
                });
            });

            test("POST - should not create a student when some student fields are the wrong type", async () => {
                payload.first_name = true;
                payload.year = 4;

                await verifyPostRequestResponseWithAuth("/students", user1.token, payload, 400, {
                    errors: [
                        {
                            type: "field",
                            location: "body",
                            path: "first_name",
                            value: payload.first_name,
                            message: "first_name must be a string",
                        },
                        {
                            type: "field",
                            location: "body",
                            path: "year",
                            value: payload.year,
                            message: "year must be a string",
                        },
                    ],
                });
            });

            test("POST - should not create a student when user does not exist", async () => {
                payload.student_id = 100;

                await verifyPostRequestResponseWithAuth("/students", user1.token, payload, 400, {
                    message: `user with id '${payload.student_id}' does not exist`,
                });
            });

            test("POST - should not create a student when school does not exist", async () => {
                payload.school_id = 100;

                await verifyPostRequestResponseWithAuth("/students", user1.token, payload, 400, {
                    message: `school with id '${payload.school_id}' does not exist`,
                });
            });

            test("POST - should not create a student when missing some fields for an interest", async () => {
                delete payload.interests[0].interest_name;

                await verifyPostRequestResponseWithAuth("/students", user1.token, payload, 400, {
                    errors: [
                        {
                            type: "field",
                            location: "body",
                            path: "interests[0].interest_name",
                            message: "interest_name is a required field",
                        },
                    ],
                });
            });

            test("POST - should not create a student when some fields for an interest are the wrong type", async () => {
                payload.interests[0].interest_name = 123;

                await verifyPostRequestResponseWithAuth("/students", user1.token, payload, 400, {
                    errors: [
                        {
                            type: "field",
                            location: "body",
                            path: "interests[0].interest_name",
                            value: payload.interests[0].interest_name,
                            message: "interest_name must be a string",
                        },
                    ],
                });
            });

            test("POST - should not create a student when missing some fields for a social media", async () => {
                delete payload.social_medias[0].url;

                await verifyPostRequestResponseWithAuth("/students", user1.token, payload, 400, {
                    errors: [
                        {
                            type: "field",
                            location: "body",
                            path: "social_medias[0].url",
                            message: "url is a required field",
                        },
                    ],
                });
            });

            test("POST - should not create a student when some fields for a social media are the wrong type", async () => {
                payload.social_medias[0].platform = ["Instagram"];

                await verifyPostRequestResponseWithAuth("/students", user1.token, payload, 400, {
                    errors: [
                        {
                            type: "field",
                            location: "body",
                            path: "social_medias[0].platform",
                            value: payload.social_medias[0].platform,
                            message: "platform must be a string",
                        },
                    ],
                });
            });

            test("POST - should not create a student when a section does not exist", async () => {
                payload.sections = [section.section_id, 100];

                await verifyPostRequestResponseWithAuth("/students", user1.token, payload, 400, {
                    message: `section with id '${payload.sections[1]}' does not exist`,
                });
            });

            test("POST - should not create a student when request is unauthenticated", async () => {
                await verifyPostRequestResponseWithAuth("/students", undefined, payload, 401, {
                    message: "unauthorized",
                });
            });
        });
    });
});
