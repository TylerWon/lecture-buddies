const { checkSchema } = require("express-validator");

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
            interests: {
                exists: {
                    errorMessage: "interests is required",
                },
                isArray: {
                    errorMessage: "interests must be an array",
                },
            },
            "interests.*.interest_name": {
                exists: {
                    errorMessage: "interest_name is required",
                },
                isString: {
                    errorMessage: "interest_name must be a string",
                },
            },
            social_medias: {
                exists: {
                    errorMessage: "social_medias is required",
                },
                isArray: {
                    errorMessage: "social_medias must be an array",
                },
            },
            "social_medias.*.platform": {
                exists: {
                    errorMessage: "platform is required",
                },
                isString: {
                    errorMessage: "platform must be a string",
                },
            },
            "social_medias.*.url": {
                exists: {
                    errorMessage: "url is required",
                },
                isString: {
                    errorMessage: "url must be a string",
                },
            },
            sections: {
                exists: {
                    errorMessage: "sections is required",
                },
                isArray: {
                    errorMessage: "sections must be an array",
                },
            },
            "sections.*": {
                isInt: {
                    errorMessage: "id must be an integer",
                },
            },
        },
        ["body"]
    );

module.exports = {
    authValidationSchema,
    createStudentValidationSchema,
};
