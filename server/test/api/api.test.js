const request = require("supertest");

const app = require("../../src/app");
const db = require("../../src/configs/db.config");
const queries = require("../utils/queries");

describe("school routes tests", () => {
    let school;
    let subject;

    beforeAll(async () => {
        school = await db.one(queries.schools.createSchool, ["University of British Columbia", "www.ubc.ca/logo.png"]);
        subject = await db.one(queries.subjects.createSubject, [school.school_id, "CPSC"]);
    });

    afterAll(async () => {
        await db.none(queries.schools.deleteSchool, [school.school_id]);
        await db.none(queries.subjects.deleteSubject, [subject.subject_id]);
        db.$pool.end();
    });

    describe("/schools", () => {
        test("GET - should return all schools", async () => {
            const response = await request(app).get("/schools");
            expect(response.statusCode).toEqual(200);
            expect(response.body).toEqual([
                {
                    school_id: school.school_id,
                    school_name: school.school_name,
                    logo_url: school.logo_url,
                },
            ]);
        });
    });

    describe("/schools/{school_id}/subjects", () => {
        test("GET - should return subjects for a school", async () => {
            const response = await request(app).get(`/schools/${school.school_id}/subjects`);
            expect(response.statusCode).toEqual(200);
            expect(response.body).toEqual([
                {
                    subject_id: subject.subject_id,
                    school_id: subject.school_id,
                    subject_name: subject.subject_name,
                },
            ]);
        });
    });
});
