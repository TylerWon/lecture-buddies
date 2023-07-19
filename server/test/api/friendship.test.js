const request = require("supertest");
const session = require("supertest-session");

const app = require("../../src/app");
const db = require("../../src/configs/db.config");
const {
    createSchool,
    createStudent,
    createUser,
    cleanUpDatabase,
    loginUser,
    verifyPostRequestResponse,
    verifyPatchRequestResponse,
} = require("../utils/helpers");

describe("friendship routes tests", () => {
    const testSession = session(app);

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

        await loginUser(testSession, user1Username, user1Password);
    });

    afterAll(async () => {
        await cleanUpDatabase(db);
        await db.$pool.end();
    });

    describe("/friendships", () => {
        let payload;

        beforeEach(() => {
            payload = {
                requestor_id: student1.student_id,
                requestee_id: student2.student_id,
            };
        });

        test("POST - should create a friendship", async () => {
            await verifyPostRequestResponse(testSession, "/friendships", payload, 201, {
                ...payload,
                friendship_status: "pending",
            });
        });

        test("POST - should not create a friendship when missing some body parameters", async () => {
            delete payload.requestor_id;

            await verifyPostRequestResponse(testSession, "/friendships", payload, 400, [
                {
                    type: "field",
                    location: "body",
                    path: "requestor_id",
                    msg: "requestor_id is required",
                },
            ]);
        });

        test("POST - should not create a friendship when some body parameters are the wrong type", async () => {
            payload.requestee_id = "-1";

            await verifyPostRequestResponse(testSession, "/friendships", payload, 400, [
                {
                    type: "field",
                    location: "body",
                    path: "requestee_id",
                    value: payload.requestee_id,
                    msg: "requestee_id must be a positive integer",
                },
            ]);
        });

        test("POST - should not create a friendship when a student does not exist", async () => {
            payload.requestor_id = payload.requestor_id + 100;

            await verifyPostRequestResponse(testSession, "/friendships", payload, 400, {
                message: `student with id '${payload.requestor_id}' does not exist`,
            });
        });

        test("POST - should not create a friendship when friendship already exists", async () => {
            await verifyPostRequestResponse(testSession, "/friendships", payload, 400, {
                message: `friendship already exists between students with ids '${payload.requestor_id}' and '${payload.requestee_id}'`,
            });
        });

        test("POST - should return error message when request is unauthenticated", async () => {
            await verifyPostRequestResponse(request(app), "/friendships", payload, 401, {
                message: "unauthenticated",
            });
        });
    });

    describe("/friendships/{requestor_id}/{requestee_id}", () => {
        let payload;

        beforeEach(() => {
            payload = {
                friendship_status: "accepted",
            };
        });

        test("PATCH - should update a friendship", async () => {
            await verifyPatchRequestResponse(
                testSession,
                `/friendships/${student1.student_id}/${student2.student_id}`,
                payload,
                200,
                {
                    requestor_id: student1.student_id,
                    requestee_id: student2.student_id,
                    ...payload,
                }
            );
        });

        test("PATCH - should not update a friendship when some body parameters are the wrong type", async () => {
            payload.friendship_status = false;

            await verifyPatchRequestResponse(
                testSession,
                `/friendships/${student1.student_id}/${student2.student_id}`,
                payload,
                400,
                [
                    {
                        type: "field",
                        location: "body",
                        path: "friendship_status",
                        value: payload.friendship_status,
                        msg: "friendship_status must be one of 'pending', 'accepted', or 'declined'",
                    },
                ]
            );
        });

        test("PATCH - should not update a friendship when friendship does not exist", async () => {
            await verifyPatchRequestResponse(
                testSession,
                `/friendships/${student1.student_id + 100}/${student2.student_id}`,
                payload,
                400,
                {
                    message: `friendship between students with ids '${student1.student_id + 100}' and '${
                        student2.student_id
                    }' does not exist`,
                }
            );
        });

        test("PATCH - should return error message when request is unauthenticated", async () => {
            await verifyPatchRequestResponse(
                request(app),
                `/friendships/${student1.student_id}/${student2.student_id}`,
                payload,
                401,
                {
                    message: "unauthenticated",
                }
            );
        });
    });
});
