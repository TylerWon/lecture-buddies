const request = require("supertest");
const session = require("supertest-session");

const app = require("../../src/app");
const db = require("../../src/configs/db.config");
const {
    createSchool,
    createSubject,
    createUser,
    cleanUpDatabase,
    loginUser,
    verifyGetRequestResponse,
} = require("../utils/helpers");

describe("school routes tests", () => {
    const testSession = session(app);

    let user1;
    let school1;
    let subject1;

    const user1Username = "won.tyler1@gmail.com";
    const user1Password = "password1";

    beforeAll(async () => {
        user1 = await createUser(db, user1Username, user1Password);
        school1 = await createSchool(db, "University of British Columbia", "2023W2", "www.ubc.ca/logo.png");
        subject1 = await createSubject(db, school1.school_id, "CPSC");

        await loginUser(testSession, user1Username, user1Password);
    });

    afterAll(async () => {
        await cleanUpDatabase(db);
        await db.$pool.end();
    });

    describe("/schools", () => {
        test("GET - should return all schools", async () => {
            await verifyGetRequestResponse(testSession, "/schools", 200, [school1]);
        });

        test("GET - should return error message when request is unauthenticated", async () => {
            await verifyGetRequestResponse(request(app), "/schools", 401, {
                message: "unauthenticated",
            });
        });
    });

    describe("/schools/{school_id}", () => {
        test("GET - should return a school", async () => {
            await verifyGetRequestResponse(testSession, `/schools/${school1.school_id}`, 200, school1);
        });

        test("GET - should return error message when the school_id path parameter does not correspond to a school", async () => {
            await verifyGetRequestResponse(testSession, `/schools/${school1.school_id + 100}`, 400, {
                message: `school with id '${school1.school_id + 100}' does not exist`,
            });
        });

        test("GET - should return error message when request is unauthenticated", async () => {
            await verifyGetRequestResponse(request(app), `/schools/${school1.school_id}`, 401, {
                message: "unauthenticated",
            });
        });
    });

    describe("/schools/{school_id}/subjects", () => {
        test("GET - should return the subjects for a school", async () => {
            await verifyGetRequestResponse(testSession, `/schools/${school1.school_id}/subjects`, 200, [subject1]);
        });

        test("GET - should return error message when the school_id path parameter does not correspond to a school", async () => {
            await verifyGetRequestResponse(testSession, `/schools/${school1.school_id + 100}/subjects`, 400, {
                message: `school with id '${school1.school_id + 100}' does not exist`,
            });
        });

        test("GET - should return error message when request is unauthenticated", async () => {
            await verifyGetRequestResponse(request(app), `/schools/${school1.school_id}/subjects`, 401, {
                message: "unauthenticated",
            });
        });
    });
});
