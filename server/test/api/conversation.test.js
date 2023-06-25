const request = require("supertest");

const app = require("../../src/app");
const db = require("../../src/configs/db.config");
const {
    createSchool,
    createStudent,
    createUser,
    cleanUpDatabase,
    verifyGetRequestResponse,
    verifyPostRequestResponseWithAuth,
} = require("../utils/helpers");

describe("conversation routes tests", () => {
    let user1;
    let user2;
    let school1;
    let student1;
    let student2;

    const user1Username = "won.tyler1@gmail.com";
    const user1Password = "password1";
    const user2Username = "won.tyler2@gmail.com";
    const user2Password = "password2";

    beforeAll(async () => {
        user1 = await createUser(db, user1Username, user1Password);
        user2 = await createUser(db, user2Username, user2Password);
        school1 = await createSchool(db, "University of British Columbia", "2023W2", "www.ubc.ca/logo.png");
        student1 = await createStudent(
            db,
            user1.user_id,
            school1.school_id,
            "Tyler",
            "Won",
            "4",
            "Science",
            "Computer Science",
            "www.tylerwon.com/profile_photo.jpg",
            "Hello. I'm Tyler. I'm a 4th year computer science student at UBC."
        );
        student2 = await createStudent(
            db,
            user2.user_id,
            school1.school_id,
            "Connor",
            "Won",
            "3",
            "Science",
            "Computer Science",
            "www.connorwon.com/profile_photo.jpg",
            "Hello. I'm Connor. I'm a 3rd year computer science student at UBC."
        );
    });

    afterAll(async () => {
        await cleanUpDatabase(db);
        await db.$pool.end();
    });

    describe("/conversations", () => {
        let payload;

        beforeEach(() => {
            payload = {
                conversation_name: "DM",
                conversation_members: [student1.student_id, student2.student_id],
            };
        });

        test("POST - should create a conversation", async () => {
            const response = await request(app)
                .post("/conversations")
                .auth(user1.token, { type: "bearer" })
                .send(payload);
            expect(response.statusCode).toEqual(200);
            expect(response.body.conversation_name).toEqual(payload.conversation_name);
            expect(response.body.conversation_members).toEqual(payload.conversation_members);
        });

        test("POST - should not create a conversation when missing some fields", async () => {
            delete payload.conversation_members;

            await verifyPostRequestResponseWithAuth(app, "/conversations", user1.token, payload, 400, [
                {
                    type: "field",
                    location: "body",
                    path: "conversation_members",
                    msg: "conversation_members is required",
                },
            ]);
        });

        test("POST - should not create a conversation when some fields are the wrong type", async () => {
            payload.conversation_members = { id1: student1.student_id, id2: student2.student_id };

            await verifyPostRequestResponseWithAuth(app, "/conversations", user1.token, payload, 400, [
                {
                    type: "field",
                    location: "body",
                    path: "conversation_members",
                    value: payload.conversation_members,
                    msg: "conversation_members must be a list of positive integers",
                },
            ]);
        });

        test("POST - should not create a conversation when a student does not exist", async () => {
            payload.conversation_members = [student1.student_id + 100, student2.student_id];

            await verifyPostRequestResponseWithAuth(app, "/conversations", user1.token, payload, 400, {
                message: `student with id '${payload.conversation_members[0]}' does not exist`,
            });
        });

        test("POST - should return error message when request is unauthenticated", async () => {
            await verifyPostRequestResponseWithAuth(app, "/conversations", undefined, payload, 401, {
                message: "unauthorized",
            });
        });
    });

    describe("/conversations/{conversation_id}/messages", () => {
        test("GET - should return the messages for a conversation", async () => {
            await verifyGetRequestResponse(
                app,
                `/conversations/${conversation1.conversation_id}/messages`,
                user1.token,
                200,
                [section1]
            );
        });

        test("GET - should return error message when the conversation_id path parameter does not correspond to a conversation", async () => {
            await verifyGetRequestResponse(
                app,
                `/conversations/${conversation1.conversation_id + 100}/messages`,
                user1.token,
                400,
                {
                    message: `conversation with id '${conversation1.conversation_id + 100}' does not exist`,
                }
            );
        });

        test("GET - should return error message when request is unauthenticated", async () => {
            await verifyPutRequestResponse(
                app,
                `/conversations/${conversation1.conversation_id}/messages`,
                undefined,
                payload,
                401,
                {
                    message: "unauthorized",
                }
            );
        });
    });
});
