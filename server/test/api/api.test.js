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
     * Checks that a POST request to an endpoint returns the expected status code and body
     *
     * @param {string} endpoint - the endpoint to send the GET request to
     * @param {string} token - the token to send with the POST request
     * @param {any} payload - the payload to send with the POST request
     * @param {number} expectedStatusCode - the expected status code of the response
     * @param {any} expectedBody - the expected body of the response
     */
    async function verifyPostRequestResponse(endpoint, token, payload, expectedStatusCode, expectedBody) {
        const response = await request(app).post(endpoint).auth(token, { type: "bearer" }).send(payload);
        expect(response.statusCode).toEqual(expectedStatusCode);
        expect(response.body).toEqual(expectedBody);
    }

    describe("auth routes tests", () => {
        describe("/auth/login", () => {
            test("POST - should log a user in when username and password are correct", async () => {
                const response = await request(app)
                    .post("/auth/login")
                    .send({ username: user1Username, password: user1Password });
                expect(response.statusCode).toEqual(200);
                expect(response.body).toEqual({ user_id: user1.user_id, token: user1.token });
            });

            test("POST - should not log a user in when username is incorrect", async () => {
                const response = await request(app)
                    .post("/auth/login")
                    .send({ username: "test@test.com", password: user1Password });
                expect(response.statusCode).toEqual(401);
                expect(response.text).toEqual("Unauthorized");
            });

            test("POST - should not log a user in when password is incorrect", async () => {
                const response = await request(app)
                    .post("/auth/login")
                    .send({ username: user1Username, password: "abcdef" });
                expect(response.statusCode).toEqual(401);
                expect(response.text).toEqual("Unauthorized");
            });
        });

        describe("/auth/logout", () => {
            test("POST - should log a user out", async () => {
                await verifyPostRequestResponse("/auth/logout", user1.token, undefined, 200, {
                    message: "Logout successful",
                });
            });

            test("POST - should not log a user out when request is unauthenticated", async () => {
                await verifyPostRequestResponse("/auth/logout", undefined, undefined, 401, {
                    message: "Unauthorized",
                });
            });
        });

        describe("/auth/signup", () => {
            test("POST - should sign a user up when username is not already in use", async () => {
                let response = await request(app)
                    .post("/auth/signup")
                    .send({ username: user2Username, password: user2Password });
                expect(response.statusCode).toEqual(200);

                response = await request(app)
                    .post("/auth/login")
                    .send({ username: user2Username, password: user2Password });
                expect(response.statusCode).toEqual(200);

                user2 = response.body;
            });

            test("POST - should not sign a user up when username is already in use", async () => {
                const response = await request(app)
                    .post("/auth/login")
                    .send({ username: user1Username, password: user1Password });
                expect(response.statusCode).toEqual(200);
                expect(response.body).toEqual({ user_id: user1.user_id, token: user1.token });
            });
        });
    });

    describe("course routes tests", () => {
        describe("/courses/{course_id}/sections", () => {
            test("GET - should return the sections for a course when course_id is valid", async () => {
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
                    message: "Unauthorized",
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
                    message: "Unauthorized",
                });
            });
        });

        describe("/schools/{school_id}/subjects", () => {
            test("GET - should return the subjects for a school when school_id is valid", async () => {
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
                    message: "Unauthorized",
                });
            });
        });
    });

    describe("subject routes tests", () => {
        describe("/subjects/{subject_id}/courses", () => {
            test("GET - should return the courses for a subject when subject_id is valid", async () => {
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
                    message: "Unauthorized",
                });
            });
        });
    });
});
