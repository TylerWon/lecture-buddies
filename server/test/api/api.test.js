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
    let subject;
    let course;
    let section;
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
        school = await db.one(queries.schools.createSchool, ["University of British Columbia", "www.ubc.ca/logo.png"]);
        subject = await db.one(queries.subjects.createSubject, [school.school_id, "CPSC"]);
        course = await db.one(queries.courses.createCourse, [
            subject.subject_id,
            "110",
            "Computation, Programs, and Programming",
        ]);
        section = await db.one(queries.sections.createSection, [course.course_id, "001", "2023W1"]);
        student1 = await db.one(queries.students.createStudent, [
            user1.user_id,
            school.school_id,
            "Tyler",
            "Won",
            "4",
            "Science",
            "Computer Science",
            "www.tylerwon.com/profile_photo.jpg",
            "Hello. I'm Tyler. I'm a 4th year computer science student at UBC.",
        ]);
        interest = await db.one(queries.interests.createInterest, [student1.student_id, "reading"]);
        socialMedia = await db.one(queries.socialMedias.createSocialMedia, [
            student1.student_id,
            "LinkedIn",
            "www.linkedin.com/tylerwon",
        ]);
    });

    afterAll(async () => {
        await db.none(queries.users.deleteUser, [user1.user_id]);
        await db.none(queries.users.deleteUser, [user2.user_id]);
        await db.none(queries.users.deleteUser, [user3.user_id]);
        await db.none(queries.schools.deleteSchool, [school.school_id]);
        await db.none(queries.subjects.deleteSubject, [subject.subject_id]);
        await db.none(queries.courses.deleteCourse, [course.course_id]);
        await db.none(queries.sections.deleteSection, [section.section_id]);
        await db.none(queries.students.deleteStudent, [student1.student_id]);
        await db.none(queries.students.deleteStudent, [student2.student_id]);
        await db.none(queries.interests.deleteInterest, [interest.interest_id]);
        await db.none(queries.socialMedias.deleteSocialMedia, [socialMedia.social_media_id]);

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
     *
     * @returns {object} the response
     */
    async function verifyGetRequestResponse(endpoint, token, expectedStatusCode, expectedBody) {
        const response = await request(app).get(endpoint).auth(token, { type: "bearer" });
        expect(response.statusCode).toEqual(expectedStatusCode);
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
                await verifyGetRequestResponse(`/courses/${course.course_id}/sections`, user1.token, 200, [section]);
            });

            test("GET - should return nothing when course_id does not correspond to a course", async () => {
                await verifyGetRequestResponse(`/courses/${course.course_id + 100}/sections`, user1.token, 200, []);
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
                await verifyGetRequestResponse("/schools", user1.token, 200, [school]);
            });

            test("GET - should return nothing when request is unauthenticated", async () => {
                await verifyGetRequestResponse("/schools", undefined, 401, {
                    message: "unauthorized",
                });
            });
        });

        describe("/schools/{school_id}/subjects", () => {
            test("GET - should return the subjects for a school", async () => {
                await verifyGetRequestResponse(`/schools/${school.school_id}/subjects`, user1.token, 200, [subject]);
            });

            test("GET - should return nothing when school_id does not correspond to a school", async () => {
                await verifyGetRequestResponse(`/schools/${school.school_id + 100}/subjects`, user1.token, 200, []);
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
                await verifyGetRequestResponse(`/subjects/${subject.subject_id}/courses`, user1.token, 200, [course]);
            });

            test("GET - should return nothing when subject_id does not correspond to a subject", async () => {
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

            test("GET - should return nothing when request is unauthenticated", async () => {
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

            test("GET - should return nothing when request is unauthenticated", async () => {
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

            test("GET - should return nothing when request is unauthenticated", async () => {
                await verifyGetRequestResponse(`/students/${student1.student_id}/social-medias`, undefined, 401, {
                    message: "unauthorized",
                });
            });
        });
    });
});
