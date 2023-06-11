const { checkSchema } = require("express-validator");

const authValidationSchema = () =>
    checkSchema({
        username: {
            in: ["body"],
            exists: {
                errorMessage: "username is required",
            },
            isString: {
                errorMessage: "username must be a string",
            },
        },
        password: {
            in: ["body"],
            exists: {
                errorMessage: "password is required",
            },
            isString: {
                errorMessage: "password must be a string",
            },
        },
    });

module.exports = {
    authValidationSchema,
};
