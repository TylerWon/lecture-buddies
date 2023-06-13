const queries = {
    courses: {
        getSectionsForCourse: "SELECT * FROM sections WHERE course_id = $1",
    },
    schools: {
        getSchools: "SELECT * FROM schools",
        getSchool: "SELECT * FROM schools WHERE school_id = $1",
        getSubjectsForSchool: "SELECT * FROM subjects WHERE school_id = $1",
    },
    subjects: {
        getCoursesForSubject: "SELECT * FROM courses WHERE subject_id = $1",
    },
    students: {
        createStudent:
            "INSERT INTO students (student_id, school_id, first_name, last_name, year, faculty, major, profile_photo_url, bio) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
        getStudent: "SELECT * FROM students WHERE student_id = $1",
        getInterestsForStudent: "SELECT * FROM interests WHERE student_id = $1",
    },
    users: {
        getUser: "SELECT * FROM users WHERE user_id = $1",
        getUserByUsername: "SELECT * FROM users WHERE username = $1",
        createUser: "INSERT INTO users (username, password, salt, token) VALUES ($1, $2, $3, $4) RETURNING *",
    },
};

module.exports = queries;
