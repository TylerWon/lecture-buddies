const request = require("supertest");
const session = require("supertest-session");

const app = require("../../src/app");
const db = require("../../src/configs/db.config");
const {
    createInterest,
    createSchool,
    createStudent,
    createUser,
    cleanUpDatabase,
    loginUser,
    verifyDeleteRequestResponse,
    verifyPostRequestResponse,
    verifyPatchRequestResponse,
} = require("../utils/helpers");

describe("interest routes tests", () => {
    const testSession = session(app);

    let user1;
    let school1;
    let student1;
    let interest1;
    let interest2;

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
        interest2 = await createInterest(db, student1.student_id, "video games");

        await loginUser(testSession, user1Username, user1Password);
    });

    afterAll(async () => {
        await cleanUpDatabase(db);
        await db.$pool.end();
    });

    describe("/interests", () => {
        let payload;

        beforeEach(() => {
            payload = {
                student_id: student1.student_id,
                interest_name: "reading",
            };
        });

        test("POST - should create an interest", async () => {
            const response = await testSession.post("/interests").send(payload);
            expect(response.statusCode).toEqual(201);
            expect(response.body.student_id).toEqual(payload.student_id);
            expect(response.body.interest_name).toEqual(payload.interest_name);
        });

        test("POST - should not create an interest when missing some body parameters", async () => {
            delete payload.student_id;

            await verifyPostRequestResponse(testSession, "/interests", payload, 400, [
                {
                    type: "field",
                    location: "body",
                    path: "student_id",
                    msg: "student_id is required",
                },
            ]);
        });

        test("POST - should not create an interest when some body parameters are the wrong type", async () => {
            payload.student_id = "-1";

            await verifyPostRequestResponse(testSession, "/interests", payload, 400, [
                {
                    type: "field",
                    location: "body",
                    path: "student_id",
                    value: payload.student_id,
                    msg: "student_id must be a positive integer",
                },
            ]);
        });

        test("POST - should not create an interest when student does not exist", async () => {
            payload.student_id = student1.student_id + 100;

            await verifyPostRequestResponse(testSession, "/interests", payload, 400, {
                message: `student with id '${payload.student_id}' does not exist`,
            });
        });

        test("POST - should return error message when request is unauthenticated", async () => {
            await verifyPostRequestResponse(request(app), "/interests", payload, 401, {
                message: "unauthenticated",
            });
        });
    });

    describe("/interests/{interest_id}", () => {
        describe("DELETE", () => {
            test("DELETE - should delete an interest", async () => {
                await verifyDeleteRequestResponse(testSession, `/interests/${interest1.interest_id}`, 200, {
                    message: `interest with id '${interest1.interest_id}' deleted`,
                });
            });

            test("DELETE - should not delete an interest when interest does not exist", async () => {
                await verifyDeleteRequestResponse(testSession, `/interests/${interest1.interest_id + 100}`, 400, {
                    message: `interest with id '${interest1.interest_id + 100}' does not exist`,
                });
            });

            test("DELETE - should return error message when request is unauthenticated", async () => {
                await verifyDeleteRequestResponse(request(app), `/interests/${interest1.interest_id}`, 401, {
                    message: "unauthenticated",
                });
            });
        });

        describe("PATCH", () => {
            let payload;

            beforeEach(() => {
                payload = {
                    interest_name: "sports",
                };
            });

            test("PATCH - should update an interest", async () => {
                await verifyPatchRequestResponse(testSession, `/interests/${interest2.interest_id}`, payload, 200, {
                    interest_id: interest2.interest_id,
                    student_id: interest2.student_id,
                    ...payload,
                });
            });

            test("PATCH - should not update an interest when some body parameters are the wrong type", async () => {
                payload.interest_name = ["sports"];

                await verifyPatchRequestResponse(testSession, `/interests/${interest2.interest_id}`, payload, 400, [
                    {
                        type: "field",
                        location: "body",
                        path: "interest_name",
                        value: payload.interest_name,
                        msg: "interest_name must be a string",
                    },
                ]);
            });

            test("PATCH - should return error message when the interest_id path parameter does not correspond to an interest", async () => {
                await verifyPatchRequestResponse(
                    testSession,
                    `/interests/${interest2.interest_id + 100}`,
                    payload,
                    400,
                    {
                        message: `interest with id '${interest2.interest_id + 100}' does not exist`,
                    }
                );
            });

            test("PATCH - should return error message when the student does not exist", async () => {
                payload.student_id = student1.student_id + 100;

                await verifyPatchRequestResponse(testSession, `/interests/${interest2.interest_id}`, payload, 400, {
                    message: `student with id '${payload.student_id}' does not exist`,
                });
            });

            test("PATCH - should return error message when request is unauthenticated", async () => {
                await verifyPatchRequestResponse(request(app), `/interests/${interest2.interest_id}`, payload, 401, {
                    message: "unauthenticated",
                });
            });
        });
    });
});
