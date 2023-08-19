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

describe("section routes tests", () => {
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

    describe("/sections/{section_id}/details", () => {
        test("GET - should return the details for a section", async () => {
            const sectionDetails1 = {
                school_id: school1.school_id,
                subject_id: subject1.subject_id,
                subject_name: subject1.subject_name,
                course_id: course1.course_id,
                course_number: course1.course_number,
                course_name: course1.course_name,
                section_id: section1.section_id,
                section_number: section1.section_number,
                section_term: section1.section_term,
            };

            await verifyGetRequestResponse(
                testSession,
                `/sections/${section1.section_id}/details`,
                200,
                sectionDetails1
            );
        });

        test("GET - should return error message when the section_id path parameter does not correspond to a section", async () => {
            await verifyGetRequestResponse(testSession, `/sections/${section1.section_id + 100}/details`, 400, {
                message: `section with id ${section1.section_id + 100} does not exist`,
            });
        });

        test("GET - should return error message when request is unauthenticated", async () => {
            await verifyGetRequestResponse(request(app), `/sections/${section1.section_id}/details`, 401, {
                message: "unauthenticated",
            });
        });
    });
});
