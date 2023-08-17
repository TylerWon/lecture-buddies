const request = require("supertest");
const session = require("supertest-session");

const app = require("../../src/app");
const db = require("../../src/configs/db.config");
const { cleanUpDatabase, signUpUser, verifyDeleteRequestResponse } = require("../utils/helpers");

describe("user routes tests", () => {
    const testSession = session(app);

    let student1;

    const user1Username = "won.tyler1@gmail.com";
    const user1Password = "password1";

    beforeAll(async () => {
        student1 = await signUpUser(testSession, user1Username, user1Password);
    });

    afterAll(async () => {
        await cleanUpDatabase(db);
        await db.$pool.end();
    });

    describe("/users/{user_id}", () => {
        test("DELETE - should delete user", async () => {
            await verifyDeleteRequestResponse(testSession, `/users/${student1.student_id}`, 200, {
                message: `user with id '${student1.student_id}' deleted`,
            });
        });

        test("DELETE - should not delete a user when user does not exist", async () => {
            await verifyDeleteRequestResponse(testSession, `/users/${student1.student_id + 100}`, 400, {
                message: `user with id '${student1.student_id + 100}' does not exist`,
            });
        });

        test("DELETE - should return error message when request is unauthenticated", async () => {
            await verifyDeleteRequestResponse(request(app), `/users/${student1.student_id}`, 401, {
                message: "unauthenticated",
            });
        });
    });
});
