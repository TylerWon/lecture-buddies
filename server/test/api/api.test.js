const request = require("supertest");

const app = require("../../src/app");
const db = require("../../src/configs/db.config");
const queries = require("../utils/queries");

describe("api tests", () => {
    let school;
    let subject;
    let course;
    let section;

    beforeAll(async () => {
        school = await db.one(queries.schools.createSchool, ["University of British Columbia", "www.ubc.ca/logo.png"]);
        subject = await db.one(queries.subjects.createSubject, [school.school_id, "CPSC"]);
        course = await db.one(queries.courses.createCourse, [
            subject.subject_id,
            "110",
            "Computation, Programs, and Programming",
        ]);
        section = await db.one(queries.sections.createSection, [course.course_id, "001", "2023W1"]);
    });

    afterAll(async () => {
        await db.none(queries.schools.deleteSchool, [school.school_id]);
        await db.none(queries.subjects.deleteSubject, [subject.subject_id]);
        await db.none(queries.courses.deleteCourse, [course.course_id]);
        await db.none(queries.sections.deleteSection, [section.section_id]);

        db.$pool.end();
    });

    /**
     * Checks that a GET request to an endpoint returns the expected status code and body
     *
     * @param {string} endpoint - the endpoint to send the GET request to
     * @param {number} expectedStatusCode - the expected status code of the response
     * @param {any} expectedBody - the expected body of the response
     */
    async function verifyGetRequestResponse(endpoint, expectedStatusCode, expectedBody) {
        const response = await request(app).get(endpoint);
        expect(response.statusCode).toEqual(expectedStatusCode);
        expect(response.body).toEqual(expectedBody);
    }

    describe("course routes tests", () => {
        describe("/courses/{course_id}/sections", () => {
            test("GET - should return the sections for a course", async () => {
                await verifyGetRequestResponse(`/courses/${course.course_id}/sections`, 200, [
                    {
                        section_id: section.section_id,
                        course_id: course.course_id,
                        section_number: section.section_number,
                        section_term: section.section_term,
                    },
                ]);
            });
        });
    });

    describe("school routes tests", () => {
        describe("/schools", () => {
            test("GET - should return all schools", async () => {
                await verifyGetRequestResponse("/schools", 200, [
                    {
                        school_id: school.school_id,
                        school_name: school.school_name,
                        logo_url: school.logo_url,
                    },
                ]);
            });
        });

        describe("/schools/{school_id}/subjects", () => {
            test("GET - should return the subjects for a school", async () => {
                await verifyGetRequestResponse(`/schools/${school.school_id}/subjects`, 200, [
                    {
                        subject_id: subject.subject_id,
                        school_id: subject.school_id,
                        subject_name: subject.subject_name,
                    },
                ]);
            });
        });
    });

    describe("subject routes tests", () => {
        describe("/subjects/{subject_id}/courses", () => {
            test("GET - should return the courses for a subject", async () => {
                await verifyGetRequestResponse(`/subjects/${subject.subject_id}/courses`, 200, [
                    {
                        course_id: course.course_id,
                        subject_id: course.subject_id,
                        course_number: course.course_number,
                        course_name: course.course_name,
                    },
                ]);
            });
        });
    });
});
