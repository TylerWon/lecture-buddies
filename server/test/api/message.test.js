const request = require("supertest");

const app = require("../../src/app");
const db = require("../../src/configs/db.config");
const {
    cleanUpDatabase,
    createConversation,
    createConversationMember,
    createSchool,
    createStudent,
    createUser,
    verifyPostRequestResponseWithAuth,
} = require("../utils/helpers");

describe("message routes tests", () => {
    let user1;
    let user2;
    let school1;
    let student1;
    let student2;
    let conversation1;

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
        conversation1 = await createConversation(db, "DM");
        await createConversationMember(db, conversation1.conversation_id, student1.student_id);
        await createConversationMember(db, conversation1.conversation_id, student2.student_id);
    });

    afterAll(async () => {
        await cleanUpDatabase(db);
        await db.$pool.end();
    });

    describe("/messages", () => {
        let payload;

        beforeEach(() => {
            payload = {
                conversation_id: conversation1.conversation_id,
                author_id: student1.student_id,
                message_content: "Hello, Connor!",
            };
        });

        test("POST - should create a message", async () => {
            const response = await request(app).post("/messages").auth(user1.token, { type: "bearer" }).send(payload);
            expect(response.statusCode).toEqual(201);
            expect(response.body.conversation_id).toEqual(payload.conversation_id);
            expect(response.body.author_id).toEqual(payload.author_id);
            expect(response.body.message_content).toEqual(payload.message_content);
        });

        test("POST - should not create a message when missing some body parameters", async () => {
            delete payload.author_id;

            await verifyPostRequestResponseWithAuth(app, "/messages", user1.token, payload, 400, [
                {
                    type: "field",
                    location: "body",
                    path: "author_id",
                    msg: "author_id is required",
                },
            ]);
        });

        test("POST - should not create a message when some body parameters are the wrong type", async () => {
            payload.message_content = 1;

            await verifyPostRequestResponseWithAuth(app, "/messages", user1.token, payload, 400, [
                {
                    type: "field",
                    location: "body",
                    path: "message_content",
                    value: payload.message_content,
                    msg: "message_content must be a string",
                },
            ]);
        });

        test("POST - should not create a message when conversation does not exist", async () => {
            payload.conversation_id = conversation1.conversation_id + 100;

            await verifyPostRequestResponseWithAuth(app, "/messages", user1.token, payload, 400, {
                message: `conversation with id '${payload.conversation_id}' does not exist`,
            });
        });

        test("POST - should not create a message when student does not exist", async () => {
            payload.author_id = student1.student_id + 100;

            await verifyPostRequestResponseWithAuth(app, "/messages", user1.token, payload, 400, {
                message: `student with id '${payload.author_id}' does not exist`,
            });
        });

        test("POST - should return error message when request is unauthenticated", async () => {
            await verifyPostRequestResponseWithAuth(app, "/messages", undefined, payload, 401, {
                message: "unauthorized",
            });
        });
    });
});
