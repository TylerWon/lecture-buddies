const queries = {
    buddies: {
        createBuddy: "INSERT INTO buddies (requestor_id, requestee_id) VALUES ($1, $2) RETURNING *",
    },
    courses: {
        createCourse: "INSERT INTO courses (subject_id, course_number, course_name) VALUES ($1, $2, $3) RETURNING *",
    },
    enrolments: {
        createEnrolment: "INSERT INTO enrolments (student_id, section_id) VALUES ($1, $2) RETURNING *",
    },
    interests: {
        createInterest: "INSERT INTO interests (student_id, interest_name) VALUES ($1, $2) RETURNING *",
    },
    schools: {
        createSchool: "INSERT INTO schools (school_name, current_term, logo_url) VALUES ($1, $2, $3) RETURNING *",
    },
    sections: {
        createSection: "INSERT INTO sections (course_id, section_number, section_term) VALUES ($1, $2, $3) RETURNING *",
    },
    socialMedias: {
        createSocialMedia:
            "INSERT INTO social_medias (student_id, social_media_platform, social_media_url) VALUES ($1, $2, $3) RETURNING *",
    },
    subjects: {
        createSubject: "INSERT INTO subjects (school_id, subject_name) VALUES ($1, $2) RETURNING *",
    },
    students: {
        createStudent:
            "INSERT INTO students (student_id, school_id, first_name, last_name, year, faculty, major, profile_photo_url, bio) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
    },
    users: {
        createUser: "INSERT INTO users (username, password, salt, token) VALUES ($1, $2, $3, $4) RETURNING *",
    },
};

module.exports = queries;
