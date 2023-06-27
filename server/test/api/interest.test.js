const request = require("supertest");

const app = require("../../src/app");
const db = require("../../src/configs/db.config");
const {
    createInterest,
    createSchool,
    createStudent,
    createUser,
    cleanUpDatabase,
    verifyDeleteRequestResponse,
    verifyPostRequestResponseWithAuth,
    verifyPutRequestResponse,
} = require("../utils/helpers");

describe("interest routes tests", () => {
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
            const response = await request(app).post("/interests").auth(user1.token, { type: "bearer" }).send(payload);
            expect(response.statusCode).toEqual(201);
            expect(response.body.student_id).toEqual(payload.student_id);
            expect(response.body.interest_name).toEqual(payload.interest_name);
        });

        test("POST - should not create an interest when missing some body parameters", async () => {
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

        test("POST - should not create an interest when some body parameters are the wrong type", async () => {
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

        test("POST - should not create an interest when student does not exist", async () => {
            payload.student_id = student1.student_id + 100;

            await verifyPostRequestResponseWithAuth(app, "/interests", user1.token, payload, 400, {
                message: `student with id '${payload.student_id}' does not exist`,
            });
        });

        test("POST - should return error message when request is unauthenticated", async () => {
            await verifyPostRequestResponseWithAuth(app, `/interests`, undefined, payload, 401, {
                message: "unauthorized",
            });
        });
    });

    describe("/interests/{interest_id}", () => {
        describe("DELETE", () => {
            test("DELETE - should delete an interest", async () => {
                await verifyDeleteRequestResponse(app, `/interests/${interest1.interest_id}`, user1.token, 200, {
                    message: "interest deleted",
                });
            });

            test("DELETE - should not delete an interest when interest does not exist", async () => {
                await verifyDeleteRequestResponse(app, `/interests/${interest1.interest_id + 100}`, user1.token, 400, {
                    message: `interest with id '${interest1.interest_id + 100}' does not exist`,
                });
            });

            test("DELETE - should return error message when request is unauthenticated", async () => {
                await verifyDeleteRequestResponse(app, `/interests/${interest1.interest_id}`, undefined, 401, {
                    message: "unauthorized",
                });
            });
        });

        describe("PUT", () => {
            let payload;

            beforeEach(() => {
                payload = { ...interest2 };
                delete payload.interest_id;
            });

            test("PUT - should update an interest", async () => {
                payload.interest_name = "sports";

                await verifyPutRequestResponse(app, `/interests/${interest2.interest_id}`, user1.token, payload, 200, {
                    ...payload,
                    interest_id: interest2.interest_id,
                });
            });

            test("PUT - should not update an interest when missing some body parameters", async () => {
                delete payload.interest_name;

                await verifyPutRequestResponse(app, `/interests/${interest2.interest_id}`, user1.token, payload, 400, [
                    {
                        type: "field",
                        location: "body",
                        path: "interest_name",
                        msg: "interest_name is required",
                    },
                ]);
            });

            test("PUT - should not update an interest when some body parameters are the wrong type", async () => {
                payload.interest_name = ["sports"];

                await verifyPutRequestResponse(app, `/interests/${interest2.interest_id}`, user1.token, payload, 400, [
                    {
                        type: "field",
                        location: "body",
                        path: "interest_name",
                        value: payload.interest_name,
                        msg: "interest_name must be a string",
                    },
                ]);
            });

            test("PUT - should return error message when the interest_id path parameter does not correspond to an interest", async () => {
                await verifyPutRequestResponse(
                    app,
                    `/interests/${interest2.interest_id + 100}`,
                    user1.token,
                    payload,
                    400,
                    {
                        message: `interest with id '${interest2.interest_id + 100}' does not exist`,
                    }
                );
            });

            test("PUT - should return error message when request is unauthenticated", async () => {
                await verifyPutRequestResponse(app, `/interests/${interest2.interest_id}`, undefined, payload, 401, {
                    message: "unauthorized",
                });
            });
        });
    });
});
