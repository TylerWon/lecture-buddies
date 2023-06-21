const request = require("supertest");

const app = require("../../src/app");
const db = require("../../src/configs/db.config");
const {
    createInterest,
    createSchool,
    createStudent,
    createUser,
    cleanUpDatabase,
    verifyPostRequestResponseWithAuth,
} = require("../utils/helpers");

describe("interest routes tests", () => {
    let user1;
    let school1;
    let student1;
    let interest1;

    const user1Username = "won.tyler1@gmail.com";
    const user1Password = "password1";

    beforeAll(async () => {
        user1 = await createUser(db, user1Username, user1Password);
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
        interest1 = await createInterest(db, student1.student_id, "reading");
    });

    afterAll(async () => {
        await cleanUpDatabase(db);
        await db.$pool.end();
    });

    describe("/interests", () => {
        let payload;

        beforeEach(() => {
            payload = {
                student_id: interest1.student_id,
                interest_name: interest1.interest_name,
            };
        });

        test("GET - should create an interest", async () => {
            const response = await request(app).post("/interests").auth(user1.token, { type: "bearer" }).send(payload);
            expect(response.statusCode).toEqual(201);
            expect(response.body.student_id).toEqual(payload.student_id);
            expect(response.body.interest_name).toEqual(payload.interest_name);
        });

        test("GET - should not create an interest when missing some fields", async () => {
            delete payload.student_id;

            await verifyPostRequestResponseWithAuth(app, "/interests", user1.token, payload, 400, [
                {
                    type: "field",
                    location: "body",
                    path: "student_id",
                    msg: "student_id is required",
                },
            ]);
        });

        test("GET - should not create an interest when some fields are the wrong type", async () => {
            payload.student_id = "-1";

            await verifyPostRequestResponseWithAuth(app, "/interests", user1.token, payload, 400, [
                {
                    type: "field",
                    location: "body",
                    path: "student_id",
                    value: payload.student_id,
                    msg: "student_id must be a positive integer",
                },
            ]);
        });

        test("GET - should not create an interest when student does not exist", async () => {
            payload.student_id = student1.student_id + 100;

            await verifyPostRequestResponseWithAuth(app, "/interests", user1.token, payload, 400, {
                message: `student with id '${payload.student_id}' does not exist`,
            });
        });

        test("GET - should return error message when request is unauthenticated", async () => {
            await verifyPostRequestResponseWithAuth(app, `/interests`, undefined, payload, 401, {
                message: "unauthorized",
            });
        });
    });
});
