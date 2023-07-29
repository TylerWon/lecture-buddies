const request = require("supertest");
const session = require("supertest-session");

const app = require("../../src/app");
const db = require("../../src/configs/db.config");
const {
    createCourse,
    createEnrolment,
    createSchool,
    createSection,
    createSubject,
    createStudent,
    createUser,
    cleanUpDatabase,
    loginUser,
    verifyPostRequestResponse,
    verifyDeleteRequestResponse,
} = require("../utils/helpers");

describe("enrolment routes tests", () => {
    const testSession = session(app);

    let user1;
    let school1;
    let course1;
    let course2;
    let section1;
    let section2;
    let student1;
    let enrolment1;

    const user1Username = "won.tyler1@gmail.com";
    const user1Password = "password1";

    beforeAll(async () => {
        user1 = await createUser(db, user1Username, user1Password);
        school1 = await createSchool(db, "University of British Columbia", "2023W2", "www.ubc.ca/logo.png");
        subject1 = await createSubject(db, school1.school_id, "CPSC");
        course1 = await createCourse(db, subject1.subject_id, "110", "Computation, Programs, and Programming");
        course2 = await createCourse(db, subject1.subject_id, "121", "Models of Computation");
        section1 = await createSection(db, course1.course_id, "001", "2023W1");
        section2 = await createSection(db, course2.course_id, "001", "2023W1");
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
        enrolment1 = await createEnrolment(db, student1.student_id, section2.section_id);

        await loginUser(testSession, user1Username, user1Password);
    });

    afterAll(async () => {
        await cleanUpDatabase(db);
        await db.$pool.end();
    });

    describe("/enrolments", () => {
        let payload;

        beforeEach(() => {
            payload = {
                student_id: student1.student_id,
                section_id: section1.section_id,
            };
        });

        test("POST - should create an enrolment", async () => {
            await verifyPostRequestResponse(testSession, "/enrolments", payload, 201, payload);
        });

        test("POST - should not create an enrolment when missing some body parameters", async () => {
            delete payload.student_id;

            await verifyPostRequestResponse(testSession, "/enrolments", payload, 400, [
                {
                    type: "field",
                    location: "body",
                    path: "student_id",
                    msg: "student_id is required",
                },
            ]);
        });

        test("POST - should not create an enrolment when some body parameters are the wrong type", async () => {
            payload.section_id = "-1";

            await verifyPostRequestResponse(testSession, "/enrolments", payload, 400, [
                {
                    type: "field",
                    location: "body",
                    path: "section_id",
                    value: payload.section_id,
                    msg: "section_id must be a positive integer",
                },
            ]);
        });

        test("POST - should not create an enrolment when the student is already enrolled in the section", async () => {
            await verifyPostRequestResponse(testSession, "/enrolments", payload, 400, {
                message: `student with id '${payload.student_id}' is already enrolled in section with id '${payload.section_id}'`,
            });
        });

        test("POST - should return error message when request is unauthenticated", async () => {
            await verifyPostRequestResponse(request(app), "/enrolments", payload, 401, {
                message: "unauthenticated",
            });
        });
    });

    describe("/enrolments/{student_id}/{section_id}", () => {
        test("DELETE - should delete an enrolment", async () => {
            await verifyDeleteRequestResponse(
                testSession,
                `/enrolments/${enrolment1.student_id}/${enrolment1.section_id}`,
                200,
                {
                    message: `enrolment with student id '${enrolment1.student_id}' and section id '${enrolment1.section_id}' deleted`,
                }
            );
        });

        test("DELETE - should not delete an enrolment when enrolment does not exist", async () => {
            await verifyDeleteRequestResponse(
                testSession,
                `/enrolments/${enrolment1.student_id + 100}/${enrolment1.section_id}`,
                400,
                {
                    message: `enrolment with student id '${enrolment1.student_id + 100}' and section id '${
                        enrolment1.section_id
                    }' does not exist`,
                }
            );
        });

        test("DELETE - should return error message when request is unauthenticated", async () => {
            await verifyDeleteRequestResponse(
                request(app),
                `/enrolments/${enrolment1.student_id}/${enrolment1.section_id}`,
                401,
                {
                    message: "unauthenticated",
                }
            );
        });
    });
});
