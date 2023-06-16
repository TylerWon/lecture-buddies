const app = require("../../src/app");
const db = require("../../src/configs/db.config");
const {
    createCourse,
    createEnrolment,
    createInterest,
    createSchool,
    createSection,
    createSocialMedia,
    createStudent,
    createSubject,
    createUser,
    cleanUpDatabase,
    verifyGetRequestResponse,
    verifyPostRequestResponseWithAuth,
} = require("../utils/helpers");

describe("student routes tests", () => {
    let user1;
    let user2;
    let student1;
    let school1;
    let subject1;
    let subject2;
    let course1;
    let course2;
    let course3;
    let section1;
    let section2;
    let section3;
    let enrolment1;
    let enrolment2;
    let enrolment3;
    let interest1;
    let socialMedia1;

    const user1Username = "won.tyler1@gmail.com";
    const user1Password = "password1";
    const user2Username = "won.tyler2@gmail.com";
    const user2Password = "password2";

    beforeAll(async () => {
        user1 = await createUser(db, user1Username, user1Password);
        user2 = await createUser(db, user2Username, user2Password);
        school1 = await createSchool(db, "University of British Columbia", "www.ubc.ca/logo.png");
        subject1 = await createSubject(db, school1.school_id, "CPSC");
        subject2 = await createSubject(db, school1.school_id, "ENGL");
        course1 = await createCourse(db, subject1.subject_id, "110", "Computation, Programs, and Programming");
        course2 = await createCourse(db, subject1.subject_id, "121", "Models of Computation");
        course3 = await createCourse(db, subject2.subject_id, "110", "Approaches to Literature and Culture");
        section1 = await createSection(db, course1.course_id, "001", "2023W1");
        section2 = await createSection(db, course2.course_id, "001", "2023W1");
        section3 = await createSection(db, course3.course_id, "001", "2023W2");
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
        socialMedia1 = await createSocialMedia(db, student1.student_id, "LinkedIn", "www.linkedin.com/tylerwon");
        enrolment1 = await createEnrolment(db, student1.student_id, section1.section_id);
        enrolment2 = await createEnrolment(db, student1.student_id, section2.section_id);
        enrolment3 = await createEnrolment(db, student1.student_id, section3.section_id);
    });

    afterAll(async () => {
        await cleanUpDatabase(db);
        await db.$pool.end();
    });

    describe("/students", () => {
        let payload;

        beforeEach(() => {
            payload = {
                student_id: user2.user_id,
                school_id: school1.school_id,
                first_name: "Connor",
                last_name: "Won",
                year: "3",
                faculty: "Science",
                major: "Computer Science",
                profile_photo_url: "www.connorwon.com/profile_photo.jpg",
                bio: "Hello. I'm Connor. I'm a 3rd year computer science student at UBC.",
            };
        });

        test("POST - should create a student", async () => {
            await verifyPostRequestResponseWithAuth(app, "/students", user1.token, payload, 201, payload);
        });

        test("POST - should not create a student when missing some fields", async () => {
            delete payload.last_name;
            delete payload.profile_photo_url;

            await verifyPostRequestResponseWithAuth(app, "/students", user1.token, payload, 400, [
                {
                    type: "field",
                    location: "body",
                    path: "last_name",
                    msg: "last_name is required",
                },
                {
                    type: "field",
                    location: "body",
                    path: "profile_photo_url",
                    msg: "profile_photo_url is required",
                },
            ]);
        });

        test("POST - should not create a student when some fields are the wrong type", async () => {
            payload.first_name = true;
            payload.year = 4;

            await verifyPostRequestResponseWithAuth(app, "/students", user1.token, payload, 400, [
                {
                    type: "field",
                    location: "body",
                    path: "first_name",
                    value: payload.first_name,
                    msg: "first_name must be a string",
                },
                {
                    type: "field",
                    location: "body",
                    path: "year",
                    value: payload.year,
                    msg: "year must be a string",
                },
            ]);
        });

        test("POST - should not create a student when user does not exist", async () => {
            payload.student_id = user2.user_id + 100;

            await verifyPostRequestResponseWithAuth(app, "/students", user1.token, payload, 400, {
                message: `user with id '${payload.student_id}' does not exist`,
            });
        });

        test("POST - should not create a student when school does not exist", async () => {
            payload.school_id = school1.school_id + 100;

            await verifyPostRequestResponseWithAuth(app, "/students", user1.token, payload, 400, {
                message: `school with id '${payload.school_id}' does not exist`,
            });
        });

        test("POST - should not create a student when request is unauthenticated", async () => {
            await verifyPostRequestResponseWithAuth(app, "/students", undefined, payload, 401, {
                message: "unauthorized",
            });
        });
    });

    describe("/students/{student_id}", () => {
        test("GET - should return a student", async () => {
            await verifyGetRequestResponse(app, `/students/${student1.student_id}`, user1.token, 200, student1);
        });

        test("GET - should return nothing when student_id does not correspond to a student", async () => {
            await verifyGetRequestResponse(app, `/students/${student1.student_id + 100}`, user1.token, 200, null);
        });

        test("GET - should return error message when request is unauthenticated", async () => {
            await verifyGetRequestResponse(app, `/students/${student1.student_id}`, undefined, 401, {
                message: "unauthorized",
            });
        });
    });

    describe("/students/{student_id}/interests", () => {
        test("GET - should return the interests for a student", async () => {
            await verifyGetRequestResponse(app, `/students/${student1.student_id}/interests`, user1.token, 200, [
                interest1,
            ]);
        });

        test("GET - should return nothing when student_id does not correspond to a student", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id + 100}/interests`,
                user1.token,
                200,
                []
            );
        });

        test("GET - should return error message when request is unauthenticated", async () => {
            await verifyGetRequestResponse(app, `/students/${student1.student_id}/interests`, undefined, 401, {
                message: "unauthorized",
            });
        });
    });

    describe("/students/{student_id}/social-medias", () => {
        test("GET - should return the social medias for a student", async () => {
            await verifyGetRequestResponse(app, `/students/${student1.student_id}/social-medias`, user1.token, 200, [
                socialMedia1,
            ]);
        });

        test("GET - should return nothing when student_id does not correspond to a student", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id + 100}/social-medias`,
                user1.token,
                200,
                []
            );
        });

        test("GET - should return error message when request is unauthenticated", async () => {
            await verifyGetRequestResponse(app, `/students/${student1.student_id}/social-medias`, undefined, 401, {
                message: "unauthorized",
            });
        });
    });

    describe("/students/{student_id}/course-history", () => {
        let courseDetails1;
        let courseDetails2;
        let courseDetails3;

        beforeAll(() => {
            courseDetails1 = {
                student_id: student1.student_id,
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

            courseDetails2 = {
                student_id: student1.student_id,
                school_id: school1.school_id,
                subject_id: subject1.subject_id,
                subject_name: subject1.subject_name,
                course_id: course2.course_id,
                course_number: course2.course_number,
                course_name: course2.course_name,
                section_id: section2.section_id,
                section_number: section2.section_number,
                section_term: section2.section_term,
            };

            courseDetails3 = {
                student_id: student1.student_id,
                school_id: school1.school_id,
                subject_id: subject2.subject_id,
                subject_name: subject2.subject_name,
                course_id: course3.course_id,
                course_number: course3.course_number,
                course_name: course3.course_name,
                section_id: section3.section_id,
                section_number: section3.section_number,
                section_term: section3.section_term,
            };
        });

        test("GET - should return the course history for a student (order by name)", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/course-history?order_by=name`,
                user1.token,
                200,
                [courseDetails1, courseDetails2, courseDetails3]
            );
        });

        test("GET - should return the course history for a student (order by -name)", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/course-history?order_by=-name`,
                user1.token,
                200,
                [courseDetails3, courseDetails2, courseDetails1]
            );
        });

        test("GET - should return nothing when student_id does not correspond to a student", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id + 100}/course-history?order_by=-name`,
                user1.token,
                200,
                []
            );
        });

        test("GET - should return error message when missing a query parameter", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id + 100}/course-history`,
                user1.token,
                400,
                [
                    {
                        type: "field",
                        location: "query",
                        path: "order_by",
                        msg: "order_by is required",
                    },
                ]
            );
        });

        test("GET - should return error message when a query parameter value is not a valid option", async () => {
            const orderBy = "-term";

            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id + 100}/course-history?order_by=${orderBy}`,
                user1.token,
                400,
                [
                    {
                        type: "field",
                        location: "query",
                        path: "order_by",
                        value: orderBy,
                        msg: "order_by must be one of 'name' or '-name'",
                    },
                ]
            );
        });

        test("GET - should return error message when request is unauthenticated", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/course-history?order_by=-name`,
                undefined,
                401,
                {
                    message: "unauthorized",
                }
            );
        });
    });
});
