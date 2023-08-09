const request = require("supertest");
const session = require("supertest-session");

const app = require("../../src/app");
const db = require("../../src/configs/db.config");
const {
    createCourse,
    createSchool,
    createSubject,
    cleanUpDatabase,
    signupUser,
    verifyGetRequestResponse,
} = require("../utils/helpers");

describe("subject routes tests", () => {
    const testSession = session(app);

    let student1;
    let school1;
    let subject1;
    let course1;

    const user1Username = "won.tyler1@gmail.com";
    const user1Password = "password1";

    beforeAll(async () => {
        student1 = await signupUser(testSession, user1Username, user1Password);
        school1 = await createSchool(db, "University of British Columbia", "2023W2", "www.ubc.ca/logo.png");
        subject1 = await createSubject(db, school1.school_id, "CPSC");
        course1 = await createCourse(db, subject1.subject_id, "110", "Computation, Programs, and Programming");
    });

    afterAll(async () => {
        await cleanUpDatabase(db);
        await db.$pool.end();
    });

    describe("/subjects/{subject_id}/courses", () => {
        test("GET - should return the courses for a subject", async () => {
            await verifyGetRequestResponse(testSession, `/subjects/${subject1.subject_id}/courses`, 200, [course1]);
        });

        test("GET - should return error message when the subject_id path parameter does not correspond to a subject", async () => {
            await verifyGetRequestResponse(testSession, `/subjects/${subject1.subject_id + 100}/courses`, 400, {
                message: `subject with id '${subject1.subject_id + 100}' does not exist`,
            });
        });

        test("GET - should return error message when request is unauthenticated", async () => {
            await verifyGetRequestResponse(request(app), `/subjects/${subject1.subject_id}/courses`, 401, {
                message: "unauthenticated",
            });
        });
    });
});
