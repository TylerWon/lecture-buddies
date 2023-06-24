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

// Enrolments
const createEnrolmentValidationSchema = () =>
    checkSchema({
        student_id: {
            exists: {
                errorMessage: "student_id is required",
            },
            isInt: {
                options: { gt: -1 },
                errorMessage: "student_id must be a positive integer",
            },
        },
        section_id: {
            exists: {
                errorMessage: "section_id is required",
            },
            isInt: {
                options: { gt: -1 },
                errorMessage: "section_id must be a positive integer",
            },
        },
    });

// Friendships
const createFriendshipValidationSchema = () =>
    checkSchema({
        requestor_id: {
            exists: {
                errorMessage: "requestor_id is required",
            },
            isInt: {
                options: { gt: -1 },
                errorMessage: "requestor_id must be a positive integer",
            },
        },
        requestee_id: {
            exists: {
                errorMessage: "requestee_id is required",
            },
            isInt: {
                options: { gt: -1 },
                errorMessage: "requestee_id must be a positive integer",
            },
        },
    });

const updateFriendshipValidationSchema = () =>
    checkSchema(
        {
            friendship_status: {
                exists: {
                    errorMessage: "friendship_status is required",
                },
                matches: {
                    options: [/^(pending|accepted|declined)$/],
                    errorMessage: "friendship_status must be one of 'pending', 'accepted', or 'declined'",
                },
            },
        },
        ["body"]
    );

// Interests
const createInterestValidationSchema = () =>
    checkSchema({
        student_id: {
            exists: {
                errorMessage: "student_id is required",
            },
            isInt: {
                options: { gt: -1 },
                errorMessage: "student_id must be a positive integer",
            },
        },
        interest_name: {
            exists: {
                errorMessage: "interest_name is required",
            },
            isString: {
                errorMessage: "interest_name must be a string",
            },
        },
    });

// Students
const createStudentValidationSchema = () =>
    checkSchema(
        {
            student_id: {
                exists: {
                    errorMessage: "student_id is required",
                },
                isInt: {
                    options: { gt: -1 },
                    errorMessage: "student_id must be a positive integer",
                },
            },
            school_id: {
                exists: {
                    errorMessage: "school_id is required",
                },
                isInt: {
                    options: { gt: -1 },
                    errorMessage: "school_id must be a positive integer",
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

const getFriendsForStudentValidationSchema = () =>
    checkSchema(
        {
            status: {
                exists: {
                    errorMessage: "status is required",
                },
                matches: {
                    options: [/^(pending|accepted|declined)$/],
                    errorMessage: "status must be one of 'pending', 'accepted', or 'declined'",
                },
            },
        },
        ["query"]
    );

// Social media
const createSocialMediaValidationSchema = () =>
    checkSchema({
        student_id: {
            exists: {
                errorMessage: "student_id is required",
            },
            isInt: {
                options: { gt: -1 },
                errorMessage: "student_id must be a positive integer",
            },
        },
        social_media_platform: {
            exists: {
                errorMessage: "social_media_platform is required",
            },
            matches: {
                options: [/^(Facebook|Instagram|LinkedIn|Twitter)$/],
                errorMessage: "social_media_platform must be one of 'Facebook', 'Instagram', 'LinkedIn', or 'Twitter'",
            },
        },
        social_media_url: {
            exists: {
                errorMessage: "social_media_url is required",
            },
            isString: {
                errorMessage: "social_media_url must be a string",
            },
        },
    });

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
    createEnrolmentValidationSchema,
    createFriendshipValidationSchema,
    updateFriendshipValidationSchema,
    createInterestValidationSchema,
    createStudentValidationSchema,
    getCourseHistoryForStudentValidationSchema,
    getFriendsForStudentValidationSchema,
    createSocialMediaValidationSchema,
    sortingAndPaginationValidationSchema,
};
