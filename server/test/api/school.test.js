const app = require("../../src/app");
const db = require("../../src/configs/db.config");
const {
    createSchool,
    createSubject,
    createUser,
    cleanUpDatabase,
    verifyGetRequestResponse,
} = require("../utils/helpers");

describe("school routes tests", () => {
    let user1;
    let school1;
    let subject1;

    const user1Username = "won.tyler1@gmail.com";
    const user1Password = "password1";

    beforeAll(async () => {
        user1 = await createUser(db, user1Username, user1Password);
        school1 = await createSchool(db, "University of British Columbia", "2023W2", "www.ubc.ca/logo.png");
        subject1 = await createSubject(db, school1.school_id, "CPSC");
    });

    afterAll(async () => {
        await cleanUpDatabase(db);
        await db.$pool.end();
    });

    describe("/schools", () => {
        test("GET - should return all schools", async () => {
            await verifyGetRequestResponse(app, "/schools", user1.token, 200, [school1]);
        });

        test("GET - should return error message when request is unauthenticated", async () => {
            await verifyGetRequestResponse(app, "/schools", undefined, 401, {
                message: "unauthorized",
            });
        });
    });

    describe("/schools/{school_id}/subjects", () => {
        test("GET - should return the subjects for a school", async () => {
            await verifyGetRequestResponse(app, `/schools/${school1.school_id}/subjects`, user1.token, 200, [subject1]);
        });

        test("GET - should return nothing when the school_id path parameter does not correspond to a school", async () => {
            await verifyGetRequestResponse(app, `/schools/${school1.school_id + 100}/subjects`, user1.token, 200, []);
        });

        test("GET - should return error message when request is unauthenticated", async () => {
            await verifyGetRequestResponse(app, `/schools/${school1.school_id}/subjects`, undefined, 401, {
                message: "unauthorized",
            });
        });
    });
});
