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

// Conversations
const createConversationValidationSchema = () =>
    checkSchema(
        {
            conversation_name: {
                exists: {
                    errorMessage: "conversation_name is required",
                },
                isString: {
                    errorMessage: "conversation_name must be a string",
                },
            },
            conversation_members: {
                exists: {
                    errorMessage: "conversation_members is required",
                },
                isArray: {
                    errorMessage: "conversation_members must be an array",
                },
            },
            "conversation_members.*": {
                isInt: {
                    options: { gt: -1 },
                    errorMessage: "conversation_members items must be positive integers",
                },
            },
        },
        ["body"]
    );

// Enrolments
const createEnrolmentValidationSchema = () =>
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
            section_id: {
                exists: {
                    errorMessage: "section_id is required",
                },
                isInt: {
                    options: { gt: -1 },
                    errorMessage: "section_id must be a positive integer",
                },
            },
        },
        ["body"]
    );

// Friendships
const createFriendshipValidationSchema = () =>
    checkSchema(
        {
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
        },
        ["body"]
    );

const updateFriendshipValidationSchema = () =>
    checkSchema(
        {
            friendship_status: {
                optional: true,
                matches: {
                    options: [/^(pending|accepted|declined)$/],
                    errorMessage: "friendship_status must be one of 'pending', 'accepted', or 'declined'",
                },
            },
        },
        ["body"]
    );

// Interests
const createUpdateInterestValidationSchema = () =>
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
            interest_name: {
                exists: {
                    errorMessage: "interest_name is required",
                },
                isString: {
                    errorMessage: "interest_name must be a string",
                },
            },
        },
        ["body"]
    );

// Messages
const createMessageValidationSchema = () =>
    checkSchema(
        {
            conversation_id: {
                exists: {
                    errorMessage: "conversation_id is required",
                },
                isInt: {
                    options: { gt: -1 },
                    errorMessage: "conversation_id must be a positive integer",
                },
            },
            author_id: {
                exists: {
                    errorMessage: "author_id is required",
                },
                isInt: {
                    options: { gt: -1 },
                    errorMessage: "author_id must be a positive integer",
                },
            },
            message_content: {
                exists: {
                    errorMessage: "message_content is required",
                },
                isString: {
                    errorMessage: "message_content must be a string",
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
                    options: { gt: -1 },
                    errorMessage: "student_id must be a positive integer",
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

const updateStudentValidationSchema = () =>
    checkSchema(
        {
            school_id: {
                optional: true,
                isInt: {
                    options: { gt: -1 },
                    errorMessage: "school_id must be a positive integer",
                },
            },
            first_name: {
                optional: true,
                isString: {
                    errorMessage: "first_name must be a string",
                },
            },
            last_name: {
                optional: true,
                isString: {
                    errorMessage: "last_name must be a string",
                },
            },
            year: {
                optional: true,
                isString: {
                    errorMessage: "year must be a string",
                },
            },
            faculty: {
                optional: true,
                isString: {
                    errorMessage: "faculty must be a string",
                },
            },
            major: {
                optional: true,
                isString: {
                    errorMessage: "major must be a string",
                },
            },
            profile_photo_url: {
                optional: true,
                isString: {
                    errorMessage: "profile_photo_url must be a string",
                },
            },
            bio: {
                optional: true,
                isString: {
                    errorMessage: "bio must be a string",
                },
            },
        },
        ["body"]
    );

// Social media
const createUpdateSocialMediaValidationSchema = () =>
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
            social_media_platform: {
                exists: {
                    errorMessage: "social_media_platform is required",
                },
                matches: {
                    options: [/^(Facebook|Instagram|LinkedIn|Twitter)$/],
                    errorMessage:
                        "social_media_platform must be one of 'Facebook', 'Instagram', 'LinkedIn', or 'Twitter'",
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
        },
        ["body"]
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
    createConversationValidationSchema,
    createEnrolmentValidationSchema,
    createFriendshipValidationSchema,
    updateFriendshipValidationSchema,
    createUpdateInterestValidationSchema,
    createMessageValidationSchema,
    createStudentValidationSchema,
    getCourseHistoryForStudentValidationSchema,
    getFriendsForStudentValidationSchema,
    updateStudentValidationSchema,
    createUpdateSocialMediaValidationSchema,
    sortingAndPaginationValidationSchema,
};
