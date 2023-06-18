const { checkSchema } = require("express-validator");

// Auth
const authValidationSchema = () =>
    checkSchema(
        {
            username: {
                exists: {
                    errorMessage: "username is required",
                },
                isString: {
                    errorMessage: "username must be a string",
                },
            },
            password: {
                exists: {
                    errorMessage: "password is required",
                },
                isString: {
                    errorMessage: "password must be a string",
                },
            },
        },
        ["body"]
    );

// Students
const createStudentValidationSchema = () =>
    checkSchema(
        {
            student_id: {
                exists: {
                    errorMessage: "student_id is required",
                },
                isInt: {
                    errorMessage: "student_id must be an integer",
                },
            },
            school_id: {
                exists: {
                    errorMessage: "school_id is required",
                },
                isInt: {
                    errorMessage: "school_id must be an integer",
                },
            },
            first_name: {
                exists: {
                    errorMessage: "first_name is required",
                },
                isString: {
                    errorMessage: "first_name must be a string",
                },
            },
            last_name: {
                exists: {
                    errorMessage: "last_name is required",
                },
                isString: {
                    errorMessage: "last_name must be a string",
                },
            },
            year: {
                exists: {
                    errorMessage: "year is required",
                },
                isString: {
                    errorMessage: "year must be a string",
                },
            },
            faculty: {
                exists: {
                    errorMessage: "faculty is required",
                },
                isString: {
                    errorMessage: "faculty must be a string",
                },
            },
            major: {
                exists: {
                    errorMessage: "major is required",
                },
                isString: {
                    errorMessage: "major must be a string",
                },
            },
            profile_photo_url: {
                exists: {
                    errorMessage: "profile_photo_url is required",
                },
                isString: {
                    errorMessage: "profile_photo_url must be a string",
                },
            },
            bio: {
                exists: {
                    errorMessage: "bio is required",
                },
                isString: {
                    errorMessage: "bio must be a string",
                },
            },
        },
        ["body"]
    );

const getCourseHistoryForStudentValidationSchema = () =>
    checkSchema(
        {
            order_by: {
                exists: {
                    errorMessage: "order_by is required",
                },
                matches: {
                    options: [/^(-?)(name)$/],
                    errorMessage: "order_by must be one of 'name' or '-name'",
                },
            },
        },
        ["query"]
    );

// General
const sortingAndPaginationValidationSchema = (orderByOptions, orderByMessage) =>
    checkSchema(
        {
            order_by: {
                exists: {
                    errorMessage: "order_by is required",
                },
                matches: {
                    options: orderByOptions,
                    errorMessage: orderByMessage,
                },
            },
            offset: {
                exists: {
                    errorMessage: "offset is required",
                },
                isInt: {
                    options: { gt: -1 },
                    errorMessage: "offset must be a positive integer",
                },
            },
            limit: {
                exists: {
                    errorMessage: "limit is required",
                },
                isInt: {
                    options: { gt: -1 },
                    errorMessage: "limit must be a positive integer",
                },
            },
        },
        ["query"]
    );

module.exports = {
    authValidationSchema,
    createStudentValidationSchema,
    getCourseHistoryForStudentValidationSchema,
    sortingAndPaginationValidationSchema,
};
