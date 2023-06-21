const request = require("supertest");

const app = require("../../src/app");
const db = require("../../src/configs/db.config");
const {
    createSchool,
    createSocialMedia,
    createStudent,
    createUser,
    cleanUpDatabase,
    verifyPostRequestResponseWithAuth,
} = require("../utils/helpers");

describe("social media routes tests", () => {
    let user1;
    let school1;
    let student1;
    let socialMedia1;

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
    });

    afterAll(async () => {
        await cleanUpDatabase(db);
        await db.$pool.end();
    });

    describe("/social-medias", () => {
        let payload;

        beforeEach(() => {
            payload = {
                student_id: socialMedia1.student_id,
                social_media_platform: socialMedia1.social_media_platform,
                social_media_url: socialMedia1.social_media_url,
            };
        });

        test("GET - should create a social media", async () => {
            const response = await request(app)
                .post("/social-medias")
                .auth(user1.token, { type: "bearer" })
                .send(payload);
            expect(response.statusCode).toEqual(201);
            expect(response.body.student_id).toEqual(payload.student_id);
            expect(response.body.social_media_platform).toEqual(payload.social_media_platform);
            expect(response.body.social_media_url).toEqual(payload.social_media_url);
        });

        test("GET - should not create a social media when missing some fields", async () => {
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

        test("GET - should not create a social media when some fields are the wrong type", async () => {
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

        test("GET - should not create a social media when student does not exist", async () => {
            await verifyPostRequestResponseWithAuth(app, "/social-medias", user1.token, payload, 400, {
                message: `student with id '${payload.student_id}' does not exist`,
            });
        });

        test("GET - should return error message when request is unauthenticated", async () => {
            await verifyPostRequestResponseWithAuth(app, `/social-medias`, undefined, payload, 401, {
                message: "unauthorized",
            });
        });
    });
});
