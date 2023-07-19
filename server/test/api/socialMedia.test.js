const request = require("supertest");
const session = require("supertest-session");

const app = require("../../src/app");
const db = require("../../src/configs/db.config");
const {
    cleanUpDatabase,
    createSchool,
    createSocialMedia,
    createStudent,
    createUser,
    loginUser,
    verifyDeleteRequestResponse,
    verifyPostRequestResponse,
    verifyPatchRequestResponse,
} = require("../utils/helpers");

describe("social media routes tests", () => {
    const testSession = session(app);

    let user1;
    let school1;
    let student1;
    let socialMedia1;
    let socialMedia2;

    const user1Username = "won.tyler1@gmail.com";
    const user1Password = "password1";

    beforeAll(async () => {
        user1 = await createUser(db, user1Username, user1Password);
        school1 = await createSchool(db, "University of British Columbia", "2023W2", "www.ubc.ca/logo.png");
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
        socialMedia1 = await createSocialMedia(db, student1.student_id, "LinkedIn", "www.linkedin.com/tylerwon");
        socialMedia2 = await createSocialMedia(db, student1.student_id, "Instagram", "www.instagram.com/connorwon");

        await loginUser(testSession, user1Username, user1Password);
    });

    afterAll(async () => {
        await cleanUpDatabase(db);
        await db.$pool.end();
    });

    describe("/social-medias", () => {
        let payload;

        beforeEach(() => {
            payload = {
                student_id: student1.student_id,
                social_media_platform: "LinkedIn",
                social_media_url: "www.linkedin.com/tylerwon",
            };
        });

        test("POST - should create a social media", async () => {
            const response = await testSession.post("/social-medias").send(payload);
            expect(response.statusCode).toEqual(201);
            expect(response.body.student_id).toEqual(payload.student_id);
            expect(response.body.social_media_platform).toEqual(payload.social_media_platform);
            expect(response.body.social_media_url).toEqual(payload.social_media_url);
        });

        test("POST - should not create a social media when missing some body parameters", async () => {
            delete payload.social_media_platform;

            await verifyPostRequestResponse(testSession, "/social-medias", payload, 400, [
                {
                    type: "field",
                    location: "body",
                    path: "social_media_platform",
                    msg: "social_media_platform is required",
                },
            ]);
        });

        test("POST - should not create a social media when some body parameters are the wrong type", async () => {
            payload.social_media_url = false;

            await verifyPostRequestResponse(testSession, "/social-medias", payload, 400, [
                {
                    type: "field",
                    location: "body",
                    path: "social_media_url",
                    value: payload.social_media_url,
                    msg: "social_media_url must be a string",
                },
            ]);
        });

        test("POST - should not create a social media when student does not exist", async () => {
            payload.student_id = student1.student_id + 100;

            await verifyPostRequestResponse(testSession, "/social-medias", payload, 400, {
                message: `student with id '${payload.student_id}' does not exist`,
            });
        });

        test("POST - should not create a social media when the social_media_platform body parameter is not a valid option", async () => {
            payload.social_media_platform = "Youtube";

            await verifyPostRequestResponse(testSession, "/social-medias", payload, 400, [
                {
                    type: "field",
                    location: "body",
                    path: "social_media_platform",
                    value: payload.social_media_platform,
                    msg: "social_media_platform must be one of 'Facebook', 'Instagram', 'LinkedIn', or 'Twitter'",
                },
            ]);
        });

        test("POST - should return error message when request is unauthenticated", async () => {
            await verifyPostRequestResponse(request(app), "/social-medias", payload, 401, {
                message: "unauthenticated",
            });
        });
    });

    describe("/social-medias/{social_media_id}", () => {
        describe("DELETE", () => {
            test("DELETE - should delete a social media", async () => {
                await verifyDeleteRequestResponse(testSession, `/social-medias/${socialMedia1.social_media_id}`, 200, {
                    message: "social media deleted",
                });
            });

            test("DELETE - should not delete a social media when social media does not exist", async () => {
                await verifyDeleteRequestResponse(
                    testSession,
                    `/social-medias/${socialMedia1.social_media_id + 100}`,
                    400,
                    {
                        message: `social media with id '${socialMedia1.social_media_id + 100}' does not exist`,
                    }
                );
            });

            test("DELETE - should return error message when request is unauthenticated", async () => {
                await verifyDeleteRequestResponse(request(app), `/social-medias/${socialMedia1.social_media_id}`, 401, {
                    message: "unauthenticated",
                });
            });
        });

        describe("PATCH", () => {
            let payload;

            beforeEach(() => {
                payload = {
                    social_media_platform: "Twitter",
                    social_media_url: "www.twitter.com/connorwon",
                };
            });

            test("PATCH - should update a social media", async () => {
                await verifyPatchRequestResponse(
                    testSession,
                    `/social-medias/${socialMedia2.social_media_id}`,
                    payload,
                    200,
                    {
                        social_media_id: socialMedia2.social_media_id,
                        student_id: socialMedia2.student_id,
                        ...payload,
                    }
                );
            });

            test("PATCH - should not update a social media when some body parameters are the wrong type", async () => {
                payload.social_media_platform = "Youtube";

                await verifyPatchRequestResponse(
                    testSession,
                    `/social-medias/${socialMedia2.social_media_id}`,
                    payload,
                    400,
                    [
                        {
                            type: "field",
                            location: "body",
                            path: "social_media_platform",
                            value: payload.social_media_platform,
                            msg: "social_media_platform must be one of 'Facebook', 'Instagram', 'LinkedIn', or 'Twitter'",
                        },
                    ]
                );
            });

            test("PATCH - should return error message when the social_media_id path parameter does not correspond to a social media", async () => {
                await verifyPatchRequestResponse(
                    testSession,
                    `/social-medias/${socialMedia2.social_media_id + 100}`,
                    payload,
                    400,
                    {
                        message: `social media with id '${socialMedia2.social_media_id + 100}' does not exist`,
                    }
                );
            });

            test("PATCH - should return error message when the student does not exist", async () => {
                payload.student_id = student1.student_id + 100;

                await verifyPatchRequestResponse(
                    testSession,
                    `/social-medias/${socialMedia2.social_media_id}`,
                    payload,
                    400,
                    {
                        message: `student with id '${payload.student_id}' does not exist`,
                    }
                );
            });

            test("PATCH - should return error message when request is unauthenticated", async () => {
                await verifyPatchRequestResponse(
                    request(app),
                    `/social-medias/${socialMedia2.social_media_id}`,
                    payload,
                    401,
                    {
                        message: "unauthenticated",
                    }
                );
            });
        });
    });
});
