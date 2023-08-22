const request = require("supertest");
const session = require("supertest-session");

const app = require("../../src/app");
const db = require("../../src/configs/db.config");
const {
    cleanUpDatabase,
    createConversation,
    createMessage,
    signUpUser,
    verifyGetRequestResponse,
    verifyPostRequestResponse,
} = require("../utils/helpers");

describe("conversation routes tests", () => {
    const testSession = session(app);

    let student1;
    let student2;
    let student3;
    let conversation1;
    let message1;
    let message2;

    const user1Username = "won.tyler1@gmail.com";
    const user1Password = "password1";
    const user2Username = "won.tyler2@gmail.com";
    const user2Password = "password2";
    const user3Username = "won.tyler3@gmail.com";
    const user3Password = "password3";

    beforeAll(async () => {
        student1 = await signUpUser(testSession, user1Username, user1Password);
        student2 = await signUpUser(testSession, user2Username, user2Password);
        student3 = await signUpUser(testSession, user3Username, user3Password);
        conversation1 = await createConversation(db, student1.student_id, student2.student_id);
        message1 = await createMessage(
            db,
            conversation1.conversation_id,
            student1.student_id,
            "This is message 1 in conversation 1"
        );
        message2 = await createMessage(
            db,
            conversation1.conversation_id,
            student2.student_id,
            "This is message 2 in conversation 1"
        );
        message1.sent_datetime = message1.sent_datetime.toJSON();
        message2.sent_datetime = message2.sent_datetime.toJSON();
    });

    afterAll(async () => {
        await cleanUpDatabase(db);
        await db.$pool.end();
    });

    describe("/conversations", () => {
        let payload;

        beforeEach(() => {
            payload = {
                student_id_1: student1.student_id,
                student_id_2: student3.student_id,
            };
        });

        test("POST - should create a conversation", async () => {
            const response = await testSession.post("/conversations").send(payload);
            expect(response.statusCode).toEqual(201);
            expect(response.body.student_id_1).toEqual(payload.student_id_1);
            expect(response.body.student_id_2).toEqual(payload.student_id_2);
        });

        test("POST - should not create a conversation when missing some body parameters", async () => {
            delete payload.student_id_1;

            await verifyPostRequestResponse(testSession, "/conversations", payload, 400, [
                {
                    type: "field",
                    location: "body",
                    path: "student_id_1",
                    msg: "student_id_1 is required",
                },
            ]);
        });

        test("POST - should not create a conversation when some body parameters are the wrong type", async () => {
            payload.student_id_2 = false;

            await verifyPostRequestResponse(testSession, "/conversations", payload, 400, [
                {
                    type: "field",
                    location: "body",
                    path: "student_id_2",
                    value: payload.student_id_2,
                    msg: "student_id_2 must be a positive integer",
                },
            ]);
        });

        test("POST - should not create a conversation when a student does not exist", async () => {
            payload.student_id_1 = payload.student_id_1 + 100;

            await verifyPostRequestResponse(testSession, "/conversations", payload, 400, {
                message: `student with id '${payload.student_id_1}' does not exist`,
            });
        });

        test("POST - should not create a conversation when the conversation already exists", async () => {
            await verifyPostRequestResponse(testSession, "/conversations", payload, 400, {
                message: `conversation between students with ids '${payload.student_id_1}' and '${payload.student_id_2}' already exists`,
            });
        });

        test("POST - should return error message when request is unauthenticated", async () => {
            await verifyPostRequestResponse(request(app), "/conversations", payload, 401, {
                message: "unauthenticated",
            });
        });
    });

    describe("/conversations/{student_id_1}/{student_id_2}", () => {
        test("GET - should return a conversation", async () => {
            await verifyGetRequestResponse(
                testSession,
                `/conversations/${student1.student_id}/${student2.student_id}`,
                200,
                conversation1
            );
        });

        test("GET - should return error message when conversation does not exist", async () => {
            await verifyGetRequestResponse(
                testSession,
                `/conversations/${student1.student_id + 100}/${student2.student_id}`,
                400,
                {
                    message: `conversation between students with ids '${student1.student_id + 100}' and '${
                        student2.student_id
                    }' does not exist`,
                }
            );
        });

        test("GET - should return error message when request is unauthenticated", async () => {
            await verifyGetRequestResponse(
                request(app),
                `/conversations/${student1.student_id}/${student2.student_id}`,
                401,
                {
                    message: "unauthenticated",
                }
            );
        });
    });

    describe("/conversations/{conversation_id}/messages", () => {
        test("GET - should return the messages for a conversation (order by date)", async () => {
            await verifyGetRequestResponse(
                testSession,
                `/conversations/${conversation1.conversation_id}/messages?order_by=date&offset=0&limit=2`,
                200,
                [message1, message2]
            );
        });

        test("GET - should return the messages for a conversation (order by -date)", async () => {
            await verifyGetRequestResponse(
                testSession,
                `/conversations/${conversation1.conversation_id}/messages?order_by=-date&offset=0&limit=2`,
                200,
                [message2, message1]
            );
        });

        test("GET - should return the messages for a conversation (0 < offset < total number of results)", async () => {
            await verifyGetRequestResponse(
                testSession,
                `/conversations/${conversation1.conversation_id}/messages?order_by=date&offset=1&limit=1`,
                200,
                [message2]
            );
        });

        test("GET - should return the messages for a conversation (limit >= total number of results)", async () => {
            await verifyGetRequestResponse(
                testSession,
                `/conversations/${conversation1.conversation_id}/messages?order_by=date&offset=0&limit=10`,
                200,
                [message1, message2]
            );
        });

        test("GET - should return nothing when offset >= total number of results", async () => {
            await verifyGetRequestResponse(
                testSession,
                `/conversations/${conversation1.conversation_id}/messages?order_by=date&offset=2&limit=2`,
                200,
                []
            );
        });

        test("GET - should return error message when the conversation_id path parameter does not correspond to a conversation", async () => {
            await verifyGetRequestResponse(
                testSession,
                `/conversations/${conversation1.conversation_id + 100}/messages?order_by=date&offset=0&limit=2`,
                400,
                {
                    message: `conversation with id '${conversation1.conversation_id + 100}' does not exist`,
                }
            );
        });

        test("GET - should return error message when missing the order_by query parameter", async () => {
            await verifyGetRequestResponse(
                testSession,
                `/conversations/${conversation1.conversation_id}/messages?offset=0&limit=2`,
                400,
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

        test("GET - should return error message when missing the offset query parameter", async () => {
            await verifyGetRequestResponse(
                testSession,
                `/conversations/${conversation1.conversation_id}/messages?order_by=date&limit=2`,
                400,
                [
                    {
                        type: "field",
                        location: "query",
                        path: "offset",
                        msg: "offset is required",
                    },
                ]
            );
        });

        test("GET - should return error message when missing the limit query parameter", async () => {
            await verifyGetRequestResponse(
                testSession,
                `/conversations/${conversation1.conversation_id}/messages?order_by=date&offset=0`,
                400,
                [
                    {
                        type: "field",
                        location: "query",
                        path: "limit",
                        msg: "limit is required",
                    },
                ]
            );
        });

        test("GET - should return error message when the order_by query parameter value is not a valid option", async () => {
            const orderBy = "conversation_name";

            await verifyGetRequestResponse(
                testSession,
                `/conversations/${conversation1.conversation_id}/messages?order_by=${orderBy}&offset=0&limit=2`,
                400,
                [
                    {
                        type: "field",
                        location: "query",
                        path: "order_by",
                        value: orderBy,
                        msg: "order_by must be one of 'date' or '-date'",
                    },
                ]
            );
        });

        test("GET - should return error message when the offset query parameter value is negative", async () => {
            const offset = "-1";

            await verifyGetRequestResponse(
                testSession,
                `/conversations/${conversation1.conversation_id}/messages?order_by=date&offset=${offset}&limit=2`,
                400,
                [
                    {
                        type: "field",
                        location: "query",
                        path: "offset",
                        value: offset,
                        msg: "offset must be a positive integer",
                    },
                ]
            );
        });

        test("GET - should return error message when the limit query parameter value is negative", async () => {
            const limit = "-1";

            await verifyGetRequestResponse(
                testSession,
                `/conversations/${conversation1.conversation_id}/messages?order_by=date&offset=0&limit=${limit}`,
                400,
                [
                    {
                        type: "field",
                        location: "query",
                        path: "limit",
                        value: limit,
                        msg: "limit must be a positive integer",
                    },
                ]
            );
        });

        test("GET - should return error message when request is unauthenticated", async () => {
            await verifyGetRequestResponse(
                request(app),
                `/conversations/${conversation1.conversation_id}/messages?order_by=date&offset=0&limit=2`,
                401,
                {
                    message: "unauthenticated",
                }
            );
        });
    });
});
