const request = require("supertest");

const app = require("../../src/app");
const db = require("../../src/configs/db.config");
const {
    createUser,
    cleanUpDatabase,
    verifyPostRequestResponseWithAuth,
    verifyPostRequestResponseWithoutAuth,
} = require("../utils/helpers");

describe("api tests", () => {
    let user1;

    const user1Username = "won.tyler1@gmail.com";
    const user1Password = "password1";
    const user2Username = "won.tyler2@gmail.com";
    const user2Password = "password2";

    beforeAll(async () => {
        user1 = await createUser(db, user1Username, user1Password);
    });

    afterAll(async () => {
        await cleanUpDatabase(db);
        await db.$pool.end();
    });

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
                verifyPostRequestResponseWithoutAuth(app, "/auth/login", payload, 200, {
                    user_id: user1.user_id,
                    token: user1.token,
                });
            });

            test("POST - should not log a user in when missing some fields", async () => {
                delete payload.username;

                await verifyPostRequestResponseWithoutAuth(app, "/auth/login", payload, 400, [
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

                await verifyPostRequestResponseWithoutAuth(app, "/auth/login", payload, 400, [
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
                await verifyPostRequestResponseWithAuth(app, "/auth/logout", user1.token, undefined, 200, {
                    message: "logout successful",
                });
            });

            test("POST - should not log a user out when request is unauthenticated", async () => {
                await verifyPostRequestResponseWithAuth(app, "/auth/logout", undefined, undefined, 401, {
                    message: "unauthorized",
                });
            });
        });

        describe("/auth/signup", () => {
            let payload;

            beforeEach(() => {
                payload = { username: user2Username, password: user2Password };
            });

            test("POST - should sign a user up", async () => {
                let response = await request(app).post("/auth/signup").send(payload);
                expect(response.statusCode).toEqual(200);

                response = await request(app).post("/auth/login").send(payload);
                expect(response.statusCode).toEqual(200);
            });

            test("POST - should not sign a user up when missing some fields", async () => {
                delete payload.username;

                await verifyPostRequestResponseWithoutAuth(app, "/auth/signup", payload, 400, [
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

                await verifyPostRequestResponseWithoutAuth(app, "/auth/signup", payload, 400, [
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

                await verifyPostRequestResponseWithoutAuth(app, "/auth/signup", payload, 400, {
                    message: "an account with that username already exists",
                });
            });
        });
    });
});
