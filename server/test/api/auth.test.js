const request = require("supertest");
const session = require("supertest-session");

const app = require("../../src/app");
const db = require("../../src/configs/db.config");
const { cleanUpDatabase, signUpUser, verifyPostRequestResponse } = require("../utils/helpers");

describe("auth routes tests", () => {
    const testSession = session(app);

    let student1;

    const user1Username = "won.tyler1@gmail.com";
    const user1Password = "password1";
    const user2Username = "won.tyler2@gmail.com";
    const user2Password = "password2";

    beforeAll(async () => {
        student1 = await signUpUser(testSession, user1Username, user1Password);
    });

    afterAll(async () => {
        await cleanUpDatabase(db);
        await db.$pool.end();
    });

    describe("/auth/autoLogin", () => {
        test("POST - should log a user in when the user's session is valid", async () => {
            await verifyPostRequestResponse(testSession, "/auth/autoLogin", undefined, 200, student1);
        });

        test("POST - should not log a user in when the user's session is invalid", async () => {
            await verifyPostRequestResponse(request(app), "/auth/autoLogin", undefined, 401, {
                message: "unauthenticated",
            });
        });
    });

    describe("/auth/login", () => {
        let payload;

        beforeEach(() => {
            payload = {
                username: user1Username,
                password: user1Password,
            };
        });

        test("POST - should log a user in", async () => {
            await verifyPostRequestResponse(request(app), "/auth/login", payload, 200, student1);
        });

        test("POST - should not log a user in when missing some body parameters", async () => {
            delete payload.username;

            await verifyPostRequestResponse(request(app), "/auth/login", payload, 400, [
                {
                    type: "field",
                    location: "body",
                    path: "username",
                    msg: "username is required",
                },
            ]);
        });

        test("POST - should not log a user in when some body parameters are the wrong type", async () => {
            payload.password = 12345678;

            await verifyPostRequestResponse(request(app), "/auth/login", payload, 400, [
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
            await verifyPostRequestResponse(testSession, "/auth/logout", undefined, 200, {
                message: "logout successful",
            });
        });

        test("POST - should not log a user out when request is unauthenticated", async () => {
            await verifyPostRequestResponse(request(app), "/auth/logout", undefined, 401, {
                message: "unauthenticated",
            });
        });
    });

    describe("/auth/signUp", () => {
        let payload;

        beforeEach(() => {
            payload = { username: user2Username, password: user2Password };
        });

        test("POST - should sign a user up", async () => {
            let response = await request(app).post("/auth/signUp").send(payload);
            expect(response.statusCode).toEqual(200);
            expect(response.body.student_id).toBeDefined();
            expect(response.body.school_id).toBeNull();
            expect(response.body.first_name).toBeNull();
            expect(response.body.last_name).toBeNull();
            expect(response.body.year).toBeNull();
            expect(response.body.faculty).toBeNull();
            expect(response.body.major).toBeNull();
            expect(response.body.bio).toBeNull();
            expect(response.body.profile_photo_url).toBeNull();
        });

        test("POST - should not sign a user up when missing some body parameters", async () => {
            delete payload.username;

            await verifyPostRequestResponse(request(app), "/auth/signUp", payload, 400, [
                {
                    type: "field",
                    location: "body",
                    path: "username",
                    msg: "username is required",
                },
            ]);
        });

        test("POST - should not sign a user up when some body parameters are the wrong type", async () => {
            payload.password = 12345678;

            await verifyPostRequestResponse(request(app), "/auth/signUp", payload, 400, [
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

            await verifyPostRequestResponse(request(app), "/auth/signUp", payload, 400, {
                message: "an account with that username already exists",
            });
        });
    });
});
