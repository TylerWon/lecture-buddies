const request = require("supertest");
const session = require("supertest-session");

const app = require("../../src/app");
const db = require("../../src/configs/db.config");
const {
    cleanUpDatabase,
    createCourse,
    createSchool,
    createSection,
    createSubject,
    signUpUser,
    verifyGetRequestResponse,
} = require("../utils/helpers");

describe("course routes tests", () => {
    const testSession = session(app);

    let student1;
    let school1;
    let course1;
    let section1;

    const user1Username = "won.tyler1@gmail.com";
    const user1Password = "password1";

    beforeAll(async () => {
        student1 = await signUpUser(testSession, user1Username, user1Password);
        school1 = await createSchool(db, "University of British Columbia", "2023W2", "www.ubc.ca/logo.png");
        subject1 = await createSubject(db, school1.school_id, "CPSC");
        course1 = await createCourse(db, subject1.subject_id, "110", "Computation, Programs, and Programming");
        section1 = await createSection(db, course1.course_id, "001", "2023W1");
    });

    afterAll(async () => {
        await cleanUpDatabase(db);
        await db.$pool.end();
    });

    describe("/courses/{course_id}/sections", () => {
        test("GET - should return the sections for a course", async () => {
            await verifyGetRequestResponse(
                testSession,
                `/courses/${course1.course_id}/sections?term=${section1.section_term}`,
                200,
                [section1]
            );
        });

        test("GET - should return nothing when there are no sections for a course in the term", async () => {
            await verifyGetRequestResponse(testSession, `/courses/${course1.course_id}/sections?term=1000W1`, 200, []);
        });

        test("GET - should return error message when the course_id path parameter does not correspond to a course", async () => {
            await verifyGetRequestResponse(
                testSession,
                `/courses/${course1.course_id + 100}/sections?term=${section1.section_term}`,
                400,
                {
                    message: `course with id ${course1.course_id + 100} does not exist`,
                }
            );
        });

        test("GET - should return error message when missing the term query parameter", async () => {
            await verifyGetRequestResponse(testSession, `/courses/${course1.course_id}/sections`, 400, [
                {
                    type: "field",
                    location: "query",
                    path: "term",
                    msg: "term is required",
                },
            ]);
        });

        test("GET - should return error message when request is unauthenticated", async () => {
            await verifyGetRequestResponse(
                request(app),
                `/courses/${course1.course_id}/sections?term=${section1.section_term}`,
                401,
                {
                    message: "unauthenticated",
                }
            );
        });
    });
});
