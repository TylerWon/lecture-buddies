const app = require("../../src/app");
const db = require("../../src/configs/db.config");
const {
    createFriendship,
    createCourse,
    createConversation,
    createConversationMember,
    createEnrolment,
    createInterest,
    createMessage,
    createSchool,
    createSection,
    createSocialMedia,
    createSubject,
    createStudent,
    createUser,
    cleanUpDatabase,
    verifyGetRequestResponse,
    verifyPostRequestResponseWithAuth,
    updateFriendship,
    verifyPutRequestResponse,
} = require("../utils/helpers");

describe("student routes tests", () => {
    let user1;
    let user2;
    let user3;
    let user4;
    let user5;
    let student1;
    let student2;
    let student3;
    let student5;
    let school1;
    let subject1;
    let subject2;
    let course1;
    let course2;
    let course3;
    let course4;
    let section1;
    let section2;
    let section3;
    let section4;
    let interest1;
    let interest2;
    let interest3;
    let socialMedia1;
    let socialMedia2;
    let socialMedia3;
    let conversation1;
    let conversation2;
    let message1;
    let message2;
    let message3;
    let friendship1;
    let friendship2;

    const user1Username = "won.tyler1@gmail.com";
    const user1Password = "password1";
    const user2Username = "won.tyler2@gmail.com";
    const user2Password = "password2";
    const user3Username = "won.tyler3@gmail.com";
    const user3Password = "password3";
    const user4Username = "won.tyler4@gmail.com";
    const user4Password = "password4";
    const user5Username = "won.tyler5@gmail.com";
    const user5Password = "password5";

    beforeAll(async () => {
        user1 = await createUser(db, user1Username, user1Password);
        user2 = await createUser(db, user2Username, user2Password);
        user3 = await createUser(db, user3Username, user3Password);
        user4 = await createUser(db, user4Username, user4Password);
        user5 = await createUser(db, user5Username, user5Password);
        school1 = await createSchool(db, "University of British Columbia", "2023W2", "www.ubc.ca/logo.png");
        subject1 = await createSubject(db, school1.school_id, "CPSC");
        subject2 = await createSubject(db, school1.school_id, "ENGL");
        course1 = await createCourse(db, subject1.subject_id, "110", "Computation, Programs, and Programming");
        course2 = await createCourse(db, subject1.subject_id, "121", "Models of Computation");
        course3 = await createCourse(db, subject2.subject_id, "110", "Approaches to Literature and Culture");
        course4 = await createCourse(db, subject2.subject_id, "112", "Studies in Composition");
        section1 = await createSection(db, course1.course_id, "001", "2023W1");
        section2 = await createSection(db, course2.course_id, "001", "2023W1");
        section3 = await createSection(db, course3.course_id, "001", "2023W2");
        section4 = await createSection(db, course4.course_id, "001", "2023W2");
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
        student2 = await createStudent(
            db,
            user2.user_id,
            school1.school_id,
            "Connor",
            "Won",
            "3",
            "Science",
            "Computer Science",
            "www.connorwon.com/profile_photo.jpg",
            "Hello. I'm Connor. I'm a 3rd year computer science student at UBC."
        );
        student3 = await createStudent(
            db,
            user3.user_id,
            school1.school_id,
            "Brian",
            "Wu",
            "4",
            "Science",
            "Cellular, Anatomical, and Physiological Sciences",
            "www.brianwu.com/profile_photo.jpg",
            "Hello. I'm Brian. I'm a 4th year cellular, anatomical, and physiological sciences student at UBC."
        );
        student5 = await createStudent(
            db,
            user5.user_id,
            school1.school_id,
            "Lyndon",
            "Won",
            "5",
            "Science",
            "Computer Science",
            "www.lyndonwon.com/profile_photo.jpg",
            "Hello. I'm Lyndon. I'm a 5th year computer science student at UBC"
        );
        interest1 = await createInterest(db, student1.student_id, "reading");
        interest2 = await createInterest(db, student2.student_id, "video games");
        interest3 = await createInterest(db, student3.student_id, "yoshi");
        socialMedia1 = await createSocialMedia(db, student1.student_id, "LinkedIn", "www.linkedin.com/tylerwon");
        socialMedia2 = await createSocialMedia(db, student2.student_id, "Instagram", "www.instagram.com/connorwon");
        socialMedia3 = await createSocialMedia(db, student3.student_id, "Facebook", "www.facebook.com/brianwu");
        await createEnrolment(db, student1.student_id, section1.section_id);
        await createEnrolment(db, student1.student_id, section2.section_id);
        await createEnrolment(db, student1.student_id, section3.section_id);
        await createEnrolment(db, student2.student_id, section1.section_id);
        await createEnrolment(db, student2.student_id, section2.section_id);
        await createEnrolment(db, student2.student_id, section3.section_id);
        await createEnrolment(db, student3.student_id, section1.section_id);
        friendship1 = await createFriendship(db, student1.student_id, student2.student_id, "pending");
        friendship2 = await createFriendship(db, student1.student_id, student3.student_id, "pending");
        conversation1 = await createConversation(db, "DM");
        conversation2 = await createConversation(db, "DM");
        await createConversationMember(db, conversation1.conversation_id, student1.student_id);
        await createConversationMember(db, conversation1.conversation_id, student2.student_id);
        await createConversationMember(db, conversation2.conversation_id, student1.student_id);
        await createConversationMember(db, conversation2.conversation_id, student3.student_id);
        message1 = await createMessage(
            db,
            conversation1.conversation_id,
            student1.student_id,
            "This is message 1 in conversation 1"
        );
        message2 = await createMessage(
            db,
            conversation1.conversation_id,
            student2.student_id,
            "This is message 2 in conversation 1"
        );
        message3 = await createMessage(
            db,
            conversation2.conversation_id,
            student1.student_id,
            "This is message 1 in conversation 2"
        );
    });

    afterAll(async () => {
        await cleanUpDatabase(db);
        await db.$pool.end();
    });

    describe("/students", () => {
        let payload;

        beforeEach(() => {
            payload = {
                student_id: user4.user_id,
                school_id: school1.school_id,
                first_name: "Tyler",
                last_name: "Won",
                year: "4",
                faculty: "Science",
                major: "Computer Science",
                profile_photo_url: "www.tylerwon.com/profile_photo.jpg",
                bio: "Hello. I'm Tyler. I'm a 4th year computer science student at UBC.",
            };
        });

        test("POST - should create a student", async () => {
            await verifyPostRequestResponseWithAuth(app, "/students", user1.access_token, payload, 201, payload);
        });

        test("POST - should not create a student when missing some body parameters", async () => {
            delete payload.last_name;
            delete payload.profile_photo_url;

            await verifyPostRequestResponseWithAuth(app, "/students", user1.access_token, payload, 400, [
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

        test("POST - should not create a student when some body parameters are the wrong type", async () => {
            payload.first_name = true;
            payload.year = 4;

            await verifyPostRequestResponseWithAuth(app, "/students", user1.access_token, payload, 400, [
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
            payload.student_id = user4.user_id + 100;

            await verifyPostRequestResponseWithAuth(app, "/students", user1.access_token, payload, 400, {
                message: `user with id '${payload.student_id}' does not exist`,
            });
        });

        test("POST - should not create a student when school does not exist", async () => {
            payload.school_id = school1.school_id + 100;

            await verifyPostRequestResponseWithAuth(app, "/students", user1.access_token, payload, 400, {
                message: `school with id '${payload.school_id}' does not exist`,
            });
        });

        test("POST - should not create a student when user is already associated with another student", async () => {
            payload.user_id = user1.user_id;

            await verifyPostRequestResponseWithAuth(app, "/students", user1.access_token, payload, 400, {
                message: `user with id '${payload.user_id}' is already associated with another student`,
            });
        });

        test("POST - should not create a student when request is unauthenticated", async () => {
            await verifyPostRequestResponseWithAuth(app, "/students", undefined, payload, 401, {
                message: "unauthorized",
            });
        });
    });

    describe("/students/{student_id}", () => {
        describe("GET", () => {
            test("GET - should return a student", async () => {
                await verifyGetRequestResponse(app, `/students/${student1.student_id}`, user1.access_token, 200, student1);
            });

            test("GET - should return error message when the student_id path parameter does not correspond to a student", async () => {
                await verifyGetRequestResponse(app, `/students/${student1.student_id + 100}`, user1.access_token, 400, {
                    message: `student with id '${student1.student_id + 100}' does not exist`,
                });
            });

            test("GET - should return error message when request is unauthenticated", async () => {
                await verifyGetRequestResponse(app, `/students/${student1.student_id}`, undefined, 401, {
                    message: "unauthorized",
                });
            });
        });

        describe("PUT", () => {
            let payload;

            beforeEach(() => {
                payload = { ...student5 };
                delete payload.student_id;
            });

            test("PUT - should update a student", async () => {
                payload.first_name = "John";
                payload.major = "Mathematics";

                await verifyPutRequestResponse(app, `/students/${student5.student_id}`, user1.access_token, payload, 200, {
                    ...payload,
                    student_id: student5.student_id,
                });
            });

            test("PUT - should not update a student when missing some body parameters", async () => {
                delete payload.school_id;
                delete payload.bio;

                await verifyPutRequestResponse(app, `/students/${student5.student_id}`, user1.access_token, payload, 400, [
                    {
                        type: "field",
                        location: "body",
                        path: "school_id",
                        msg: "school_id is required",
                    },
                    {
                        type: "field",
                        location: "body",
                        path: "bio",
                        msg: "bio is required",
                    },
                ]);
            });

            test("PUT - should not update a student when some body parameters are the wrong type", async () => {
                payload.faculty = 1;
                payload.profile_photo_url = false;

                await verifyPutRequestResponse(app, `/students/${student5.student_id}`, user1.access_token, payload, 400, [
                    {
                        type: "field",
                        location: "body",
                        path: "faculty",
                        value: payload.faculty,
                        msg: "faculty must be a string",
                    },
                    {
                        type: "field",
                        location: "body",
                        path: "profile_photo_url",
                        value: payload.profile_photo_url,
                        msg: "profile_photo_url must be a string",
                    },
                ]);
            });

            test("PUT - should return error message when the student_id path parameter does not correspond to a student", async () => {
                await verifyPutRequestResponse(
                    app,
                    `/students/${student5.student_id + 100}`,
                    user1.access_token,
                    payload,
                    400,
                    {
                        message: `student with id '${student5.student_id + 100}' does not exist`,
                    }
                );
            });

            test("PUT - should not update a student when school does not exist", async () => {
                payload.school_id = school1.school_id + 100;

                await verifyPutRequestResponse(app, `/students/${student5.student_id}`, user1.access_token, payload, 400, {
                    message: `school with id '${payload.school_id}' does not exist`,
                });
            });

            test("PUT - should not update a student when request is unauthenticated", async () => {
                await verifyPutRequestResponse(app, `/students/${student5.student_id}`, undefined, payload, 401, {
                    message: "unauthorized",
                });
            });
        });
    });

    describe("/students/{student_id}/friends", () => {
        let classmateDetails1;
        let classmateDetails2;
        let courseDetails3;

        beforeAll(async () => {
            courseDetails3 = {
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

            classmateDetails1 = {
                ...student2,
                friendship_status: friendship1.friendship_status,
                interests: [interest2],
                social_medias: [socialMedia2],
                current_mutual_courses: [courseDetails3],
            };

            classmateDetails2 = {
                ...student3,
                friendship_status: friendship2.friendship_status,
                interests: [interest3],
                social_medias: [socialMedia3],
                current_mutual_courses: [],
            };
        });

        describe("status tests", () => {
            afterAll(async () => {
                friendship1 = await updateFriendship(db, student1.student_id, student2.student_id, "pending");
                friendship2 = await updateFriendship(db, student1.student_id, student3.student_id, "pending");

                classmateDetails1.friendship_status = friendship1.friendship_status;
                classmateDetails2.friendship_status = friendship2.friendship_status;
            });

            test("GET - should return the friends for a student (status pending)", async () => {
                friendship1 = await updateFriendship(db, student1.student_id, student2.student_id, "pending");
                friendship2 = await updateFriendship(db, student1.student_id, student3.student_id, "pending");

                classmateDetails1.friendship_status = friendship1.friendship_status;
                classmateDetails2.friendship_status = friendship2.friendship_status;

                await verifyGetRequestResponse(
                    app,
                    `/students/${student1.student_id}/friends?status=pending&order_by=name&offset=0&limit=2`,
                    user1.access_token,
                    200,
                    [classmateDetails2, classmateDetails1]
                );
            });

            test("GET - should return the friends for a student (status accepted)", async () => {
                friendship1 = await updateFriendship(db, student1.student_id, student2.student_id, "accepted");
                friendship2 = await updateFriendship(db, student1.student_id, student3.student_id, "accepted");

                classmateDetails1.friendship_status = friendship1.friendship_status;
                classmateDetails2.friendship_status = friendship2.friendship_status;

                const courseDetails1 = {
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

                const courseDetails2 = {
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

                classmateDetails1.previous_mutual_courses = [courseDetails1, courseDetails2];
                classmateDetails2.previous_mutual_courses = [courseDetails1];

                await verifyGetRequestResponse(
                    app,
                    `/students/${student1.student_id}/friends?status=accepted&order_by=name&offset=0&limit=2`,
                    user1.access_token,
                    200,
                    [classmateDetails2, classmateDetails1]
                );

                delete classmateDetails1.previous_mutual_courses;
                delete classmateDetails2.previous_mutual_courses;
            });

            test("GET - should return the friends for a student (status declined)", async () => {
                friendship1 = await updateFriendship(db, student1.student_id, student2.student_id, "declined");
                friendship2 = await updateFriendship(db, student1.student_id, student3.student_id, "declined");

                classmateDetails1.friendship_status = friendship1.friendship_status;
                classmateDetails2.friendship_status = friendship2.friendship_status;

                await verifyGetRequestResponse(
                    app,
                    `/students/${student1.student_id}/friends?status=declined&order_by=name&offset=0&limit=2`,
                    user1.access_token,
                    200,
                    [classmateDetails2, classmateDetails1]
                );
            });
        });

        test("GET - should return the friends for a student (order by name)", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/friends?status=pending&order_by=name&offset=0&limit=2`,
                user1.access_token,
                200,
                [classmateDetails2, classmateDetails1]
            );
        });

        test("GET - should return the friends for a student (order by -name)", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/friends?status=pending&order_by=-name&offset=0&limit=2`,
                user1.access_token,
                200,
                [classmateDetails1, classmateDetails2]
            );
        });

        test("GET - should return the friends for a student (0 < offset < total number of results)", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/friends?status=pending&order_by=name&offset=1&limit=1`,
                user1.access_token,
                200,
                [classmateDetails1]
            );
        });

        test("GET - should return the friends for a student (limit >= total number of results)", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/friends?status=pending&order_by=name&offset=0&limit=10`,
                user1.access_token,
                200,
                [classmateDetails2, classmateDetails1]
            );
        });

        test("GET - should return nothing when offset >= total number of results", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/friends?status=pending&order_by=name&offset=2&limit=2`,
                user1.access_token,
                200,
                []
            );
        });

        test("GET - should return error message when the student_id path parameter does not correspond to a student", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id + 100}/friends?status=pending&order_by=name&offset=0&limit=2`,
                user1.access_token,
                400,
                { message: `student with id '${student1.student_id + 100}' does not exist` }
            );
        });

        test("GET - should return error message when missing the status query parameter", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/friends?order_by=name&offset=0&limit=2`,
                user1.access_token,
                400,
                [
                    {
                        type: "field",
                        location: "query",
                        path: "status",
                        msg: "status is required",
                    },
                ]
            );
        });

        test("GET - should return error message when missing the order_by query parameter", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/friends?status=pending&offset=0&limit=2`,
                user1.access_token,
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

        test("GET - should return error message when missing the offset query parameter", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/friends?status=pending&order_by=name&limit=2`,
                user1.access_token,
                400,
                [
                    {
                        type: "field",
                        location: "query",
                        path: "offset",
                        msg: "offset is required",
                    },
                ]
            );
        });

        test("GET - should return error message when missing the limit query parameter", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/friends?status=pending&order_by=name&offset=0`,
                user1.access_token,
                400,
                [
                    {
                        type: "field",
                        location: "query",
                        path: "limit",
                        msg: "limit is required",
                    },
                ]
            );
        });

        test("GET - should return error message when the status query parameter value is not a valid option", async () => {
            const status = "invalid";

            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/friends?status=${status}&order_by=name&offset=0&limit=2`,
                user1.access_token,
                400,
                [
                    {
                        type: "field",
                        location: "query",
                        path: "status",
                        value: status,
                        msg: "status must be one of 'pending', 'accepted', or 'declined'",
                    },
                ]
            );
        });

        test("GET - should return error message when the order_by query parameter value is not a valid option", async () => {
            const orderBy = "num_mutual_courses";

            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/friends?status=pending&order_by=${orderBy}&offset=0&limit=2`,
                user1.access_token,
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

        test("GET - should return error message when the offset query parameter value is negative", async () => {
            const offset = "-1";

            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/friends?status=pending&order_by=name&offset=${offset}&limit=2`,
                user1.access_token,
                400,
                [
                    {
                        type: "field",
                        location: "query",
                        path: "offset",
                        value: offset,
                        msg: "offset must be a positive integer",
                    },
                ]
            );
        });

        test("GET - should return error message when the limit query parameter value is negative", async () => {
            const limit = "-1";

            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/friends?status=pending&order_by=name&offset=0&limit=${limit}`,
                user1.access_token,
                400,
                [
                    {
                        type: "field",
                        location: "query",
                        path: "limit",
                        value: limit,
                        msg: "limit must be a positive integer",
                    },
                ]
            );
        });

        test("GET - should return error message when request is unauthenticated", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/friends?status=pending&order_by=name&offset=0&limit=2`,
                undefined,
                401,
                {
                    message: "unauthorized",
                }
            );
        });
    });

    describe("/students/{student_id}/conversations", () => {
        let conversationDetails1;
        let conversationDetails2;

        beforeAll(() => {
            message2.sent_datetime = message2.sent_datetime.toJSON();
            message3.sent_datetime = message3.sent_datetime.toJSON();

            conversationDetails1 = {
                conversation_id: conversation1.conversation_id,
                conversation_name: conversation1.conversation_name,
                conversation_members: [student1, student2],
                most_recent_message: message2,
            };

            conversationDetails2 = {
                conversation_id: conversation2.conversation_id,
                conversation_name: conversation2.conversation_name,
                conversation_members: [student1, student3],
                most_recent_message: message3,
            };
        });

        test("GET - should return the conversation history for a student (order by date)", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/conversations?order_by=date&offset=0&limit=2`,
                user1.access_token,
                200,
                [conversationDetails1, conversationDetails2]
            );
        });

        test("GET - should return the conversation history for a student (order by -date)", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/conversations?order_by=-date&offset=0&limit=2`,
                user1.access_token,
                200,
                [conversationDetails2, conversationDetails1]
            );
        });

        test("GET - should return the conversation history for a student (0 < offset < total number of results)", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/conversations?order_by=date&offset=1&limit=1`,
                user1.access_token,
                200,
                [conversationDetails2]
            );
        });

        test("GET - should return the conversation history for a student (limit >= total number of results)", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/conversations?order_by=date&offset=0&limit=10`,
                user1.access_token,
                200,
                [conversationDetails1, conversationDetails2]
            );
        });

        test("GET - should return nothing when offset >= total number of results", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/conversations?order_by=date&offset=2&limit=2`,
                user1.access_token,
                200,
                []
            );
        });

        test("GET - should return error message when the student_id path parameter does not correspond to a student", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id + 100}/conversations?order_by=date&offset=0&limit=2`,
                user1.access_token,
                400,
                {
                    message: `student with id '${student1.student_id + 100}' does not exist`,
                }
            );
        });

        test("GET - should return error message when missing the order_by query parameter", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/conversations?offset=0&limit=2`,
                user1.access_token,
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

        test("GET - should return error message when missing the offset query parameter", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/conversations?order_by=date&limit=2`,
                user1.access_token,
                400,
                [
                    {
                        type: "field",
                        location: "query",
                        path: "offset",
                        msg: "offset is required",
                    },
                ]
            );
        });

        test("GET - should return error message when missing the limit query parameter", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/conversations?order_by=date&offset=0`,
                user1.access_token,
                400,
                [
                    {
                        type: "field",
                        location: "query",
                        path: "limit",
                        msg: "limit is required",
                    },
                ]
            );
        });

        test("GET - should return error message when the order_by query parameter value is not a valid option", async () => {
            const orderBy = "conversation_name";

            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/conversations?order_by=${orderBy}&offset=0&limit=2`,
                user1.access_token,
                400,
                [
                    {
                        type: "field",
                        location: "query",
                        path: "order_by",
                        value: orderBy,
                        msg: "order_by must be one of 'date' or '-date'",
                    },
                ]
            );
        });

        test("GET - should return error message when the offset query parameter value is negative", async () => {
            const offset = "-1";

            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/conversations?order_by=date&offset=${offset}&limit=2`,
                user1.access_token,
                400,
                [
                    {
                        type: "field",
                        location: "query",
                        path: "offset",
                        value: offset,
                        msg: "offset must be a positive integer",
                    },
                ]
            );
        });

        test("GET - should return error message when the limit query parameter value is negative", async () => {
            const limit = "-1";

            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/conversations?order_by=date&offset=0&limit=${limit}`,
                user1.access_token,
                400,
                [
                    {
                        type: "field",
                        location: "query",
                        path: "limit",
                        value: limit,
                        msg: "limit must be a positive integer",
                    },
                ]
            );
        });

        test("GET - should return error message when request is unauthenticated", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/conversations?order_by=date&offset=0&limit=2`,
                undefined,
                401,
                {
                    message: "unauthorized",
                }
            );
        });
    });

    describe("/students/{student_id}/course-history", () => {
        let courseDetails1;
        let courseDetails2;
        let courseDetails3;

        beforeAll(() => {
            courseDetails1 = {
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
                user1.access_token,
                200,
                [courseDetails1, courseDetails2, courseDetails3]
            );
        });

        test("GET - should return the course history for a student (order by -name)", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/course-history?order_by=-name`,
                user1.access_token,
                200,
                [courseDetails3, courseDetails2, courseDetails1]
            );
        });

        test("GET - should return error message when the student_id path parameter does not correspond to a student", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id + 100}/course-history?order_by=-name`,
                user1.access_token,
                400,
                {
                    message: `student with id '${student1.student_id + 100}' does not exist`,
                }
            );
        });

        test("GET - should return error message when missing the order_by query parameter", async () => {
            await verifyGetRequestResponse(app, `/students/${student1.student_id}/course-history`, user1.access_token, 400, [
                {
                    type: "field",
                    location: "query",
                    path: "order_by",
                    msg: "order_by is required",
                },
            ]);
        });

        test("GET - should return error message when the order_by query parameter value is not a valid option", async () => {
            const orderBy = "-term";

            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/course-history?order_by=${orderBy}`,
                user1.access_token,
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

    describe("/students/{student_id}/interests", () => {
        test("GET - should return the interests for a student", async () => {
            await verifyGetRequestResponse(app, `/students/${student1.student_id}/interests`, user1.access_token, 200, [
                interest1,
            ]);
        });

        test("GET - should return error message when the student_id path parameter does not correspond to a student", async () => {
            await verifyGetRequestResponse(app, `/students/${student1.student_id + 100}/interests`, user1.access_token, 400, {
                message: `student with id '${student1.student_id + 100}' does not exist`,
            });
        });

        test("GET - should return error message when request is unauthenticated", async () => {
            await verifyGetRequestResponse(app, `/students/${student1.student_id}/interests`, undefined, 401, {
                message: "unauthorized",
            });
        });
    });

    describe("/students/{student_id}/sections/{section_id}/classmates", () => {
        let classmateDetails1;
        let classmateDetails2;
        let courseDetails1;
        let courseDetails2;

        beforeAll(() => {
            courseDetails1 = {
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

            classmateDetails1 = {
                ...student2,
                friendship_status: friendship1.friendship_status,
                interests: [interest2],
                social_medias: [socialMedia2],
                mutual_courses_for_term: [courseDetails1, courseDetails2],
            };

            classmateDetails2 = {
                ...student3,
                friendship_status: friendship2.friendship_status,
                interests: [interest3],
                social_medias: [socialMedia3],
                mutual_courses_for_term: [courseDetails1],
            };
        });

        test("GET - should return the classmates for a student (order by num_mutual_courses)", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/sections/${section1.section_id}/classmates?order_by=num_mutual_courses&offset=0&limit=2`,
                user1.access_token,
                200,
                [classmateDetails2, classmateDetails1]
            );
        });

        test("GET - should return the classmates for a student (order by -num_mutual_courses)", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/sections/${section1.section_id}/classmates?order_by=-num_mutual_courses&offset=0&limit=2`,
                user1.access_token,
                200,
                [classmateDetails1, classmateDetails2]
            );
        });

        test("GET - should return the classmates for a student (order by name)", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/sections/${section1.section_id}/classmates?order_by=name&offset=0&limit=2`,
                user1.access_token,
                200,
                [classmateDetails2, classmateDetails1]
            );
        });

        test("GET - should return the classmates for a student (order by -name)", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/sections/${section1.section_id}/classmates?order_by=-name&offset=0&limit=2`,
                user1.access_token,
                200,
                [classmateDetails1, classmateDetails2]
            );
        });

        test("GET - should return the classmates for a student (order by year)", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/sections/${section1.section_id}/classmates?order_by=year&offset=0&limit=2`,
                user1.access_token,
                200,
                [classmateDetails1, classmateDetails2]
            );
        });

        test("GET - should return the classmates for a student (order by -year)", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/sections/${section1.section_id}/classmates?order_by=-year&offset=0&limit=2`,
                user1.access_token,
                200,
                [classmateDetails2, classmateDetails1]
            );
        });

        test("GET - should return the classmates for a student (order by major)", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/sections/${section1.section_id}/classmates?order_by=major&offset=0&limit=2`,
                user1.access_token,
                200,
                [classmateDetails2, classmateDetails1]
            );
        });

        test("GET - should return the classmates for a student (order by -major)", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/sections/${section1.section_id}/classmates?order_by=-major&offset=0&limit=2`,
                user1.access_token,
                200,
                [classmateDetails1, classmateDetails2]
            );
        });

        test("GET - should return the classmates for a student (0 < offset < total number of results)", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/sections/${section1.section_id}/classmates?order_by=num_mutual_courses&offset=1&limit=1`,
                user1.access_token,
                200,
                [classmateDetails1]
            );
        });

        test("GET - should return the classmates for a student (limit >= total number of results)", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/sections/${section1.section_id}/classmates?order_by=num_mutual_courses&offset=0&limit=10`,
                user1.access_token,
                200,
                [classmateDetails2, classmateDetails1]
            );
        });

        test("GET - should return nothing when offset >= total number of results", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/sections/${section1.section_id}/classmates?order_by=num_mutual_courses&offset=2&limit=2`,
                user1.access_token,
                200,
                []
            );
        });

        test("GET - should return error message when the student_id path parameter does not correspond to a student", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id + 100}/sections/${
                    section1.section_id
                }/classmates?order_by=num_mutual_courses&offset=0&limit=2`,
                user1.access_token,
                400,
                {
                    message: `student with id '${student1.student_id + 100}' does not exist`,
                }
            );
        });

        test("GET - should return error message when the section_id path parameter does not correspond to a section", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/sections/${
                    section1.section_id + 100
                }/classmates?order_by=num_mutual_courses&offset=0&limit=2`,
                user1.access_token,
                400,
                {
                    message: `section with id '${section1.section_id + 100}' does not exist`,
                }
            );
        });

        test("GET - should return error message when the student is not enrolled in the section", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/sections/${section4.section_id}/classmates?order_by=num_mutual_courses&offset=0&limit=2`,
                user1.access_token,
                400,
                {
                    message: `student with id '${student1.student_id}' is not enrolled in section with id '${section4.section_id}'`,
                }
            );
        });

        test("GET - should return error message when missing the order_by query parameter", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/sections/${section1.section_id}/classmates?&offset=0&limit=2`,
                user1.access_token,
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

        test("GET - should return error message when missing the offset query parameter", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/sections/${section1.section_id}/classmates?order_by=num_mutual_courses&limit=2`,
                user1.access_token,
                400,
                [
                    {
                        type: "field",
                        location: "query",
                        path: "offset",
                        msg: "offset is required",
                    },
                ]
            );
        });

        test("GET - should return error message when missing the limit query parameter", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/sections/${section1.section_id}/classmates?order_by=num_mutual_courses&offset=0`,
                user1.access_token,
                400,
                [
                    {
                        type: "field",
                        location: "query",
                        path: "limit",
                        msg: "limit is required",
                    },
                ]
            );
        });

        test("GET - should return error message when the order_by query parameter value is not a valid option", async () => {
            const orderBy = "faculty";

            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/sections/${section1.section_id}/classmates?order_by=${orderBy}&offset=0&limit=2`,
                user1.access_token,
                400,
                [
                    {
                        type: "field",
                        location: "query",
                        path: "order_by",
                        value: orderBy,
                        msg: "order_by must be one of 'num_mutual_courses', '-num_mutual_courses', 'name', '-name', 'year', '-year', 'major', '-major''",
                    },
                ]
            );
        });

        test("GET - should return error message when the offset query parameter value is negative", async () => {
            const offset = "-1";

            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/sections/${section1.section_id}/classmates?order_by=num_mutual_courses&offset=${offset}&limit=2`,
                user1.access_token,
                400,
                [
                    {
                        type: "field",
                        location: "query",
                        path: "offset",
                        value: offset,
                        msg: "offset must be a positive integer",
                    },
                ]
            );
        });

        test("GET - should return error message when the limit query parameter value is negative", async () => {
            const limit = "-1";

            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/sections/${section1.section_id}/classmates?order_by=num_mutual_courses&offset=0&limit=${limit}`,
                user1.access_token,
                400,
                [
                    {
                        type: "field",
                        location: "query",
                        path: "limit",
                        value: limit,
                        msg: "limit must be a positive integer",
                    },
                ]
            );
        });

        test("GET - should return error message when request is unauthenticated", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id}/sections/${section1.section_id}/classmates?order_by=num_mutual_courses&offset=0&limit=2`,
                undefined,
                401,
                {
                    message: "unauthorized",
                }
            );
        });
    });

    describe("/students/{student_id}/social-medias", () => {
        test("GET - should return the social medias for a student", async () => {
            await verifyGetRequestResponse(app, `/students/${student1.student_id}/social-medias`, user1.access_token, 200, [
                socialMedia1,
            ]);
        });

        test("GET - should return error message when the student_id path parameter does not correspond to a student", async () => {
            await verifyGetRequestResponse(
                app,
                `/students/${student1.student_id + 100}/social-medias`,
                user1.access_token,
                400,
                {
                    message: `student with id '${student1.student_id + 100}' does not exist`,
                }
            );
        });

        test("GET - should return error message when request is unauthenticated", async () => {
            await verifyGetRequestResponse(app, `/students/${student1.student_id}/social-medias`, undefined, 401, {
                message: "unauthorized",
            });
        });
    });
});
