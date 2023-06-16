const app = require("../../src/app");
const db = require("../../src/configs/db.config");
const {
    createCourse,
    createSchool,
    createSection,
    createSubject,
    createUser,
    cleanUpDatabase,
    verifyGetRequestResponse,
} = require("../utils/helpers");

describe("course routes tests", () => {
    let user1;
    let school1;
    let course1;
    let section1;

    const user1Username = "won.tyler1@gmail.com";
    const user1Password = "password1";

    beforeAll(async () => {
        user1 = await createUser(db, user1Username, user1Password);
        school1 = await createSchool(db, "University of British Columbia", "www.ubc.ca/logo.png");
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
            await verifyGetRequestResponse(app, `/courses/${course1.course_id}/sections`, user1.token, 200, [section1]);
        });

        test("GET - should return nothing when course_id does not correspond to a course", async () => {
            await verifyGetRequestResponse(app, `/courses/${course1.course_id + 100}/sections`, user1.token, 200, []);
        });

        test("GET - should return error message when request is unauthenticated", async () => {
            await verifyGetRequestResponse(app, `/courses/${course1.course_id}/sections`, undefined, 401, {
                message: "unauthorized",
            });
        });
    });
});
