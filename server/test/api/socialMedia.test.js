const request = require("supertest");

const app = require("../../src/app");
const db = require("../../src/configs/db.config");
const {
    createSchool,
    createStudent,
    createUser,
    cleanUpDatabase,
    verifyPostRequestResponseWithAuth,
} = require("../utils/helpers");

describe("social media routes tests", () => {
    let user1;
    let school1;
    let student1;

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
            const response = await request(app)
                .post("/social-medias")
                .auth(user1.token, { type: "bearer" })
                .send(payload);
            expect(response.statusCode).toEqual(201);
            expect(response.body.student_id).toEqual(payload.student_id);
            expect(response.body.social_media_platform).toEqual(payload.social_media_platform);
            expect(response.body.social_media_url).toEqual(payload.social_media_url);
        });

        test("POST - should not create a social media when missing some fields", async () => {
            delete payload.social_media_platform;

            await verifyPostRequestResponseWithAuth(app, "/social-medias", user1.token, payload, 400, [
                {
                    type: "field",
                    location: "body",
                    path: "social_media_platform",
                    msg: "social_media_platform is required",
                },
            ]);
        });

        test("POST - should not create a social media when some fields are the wrong type", async () => {
            payload.social_media_url = false;

            await verifyPostRequestResponseWithAuth(app, "/social-medias", user1.token, payload, 400, [
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

            await verifyPostRequestResponseWithAuth(app, "/social-medias", user1.token, payload, 400, {
                message: `student with id '${payload.student_id}' does not exist`,
            });
        });

        test("POST - should not create a social media when the social_media_platform body parameter is not a valid option", async () => {
            payload.social_media_platform = "Youtube";

            await verifyPostRequestResponseWithAuth(app, "/social-medias", user1.token, payload, 400, [
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
            await verifyPostRequestResponseWithAuth(app, `/social-medias`, undefined, payload, 401, {
                message: "unauthorized",
            });
        });
    });
});
