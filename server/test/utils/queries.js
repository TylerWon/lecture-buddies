const queries = {
    courses: {
        createCourse: "INSERT INTO courses (subject_id, course_number, course_name) VALUES ($1, $2, $3) RETURNING *",
        deleteCourse: "DELETE FROM courses WHERE course_id = $1",
    },
    interests: {
        createInterest: "INSERT INTO interests (student_id, interest_name) VALUES ($1, $2) RETURNING *",
        deleteInterest: "DELETE FROM interests WHERE interest_id = $1",
    },
    schools: {
        createSchool: "INSERT INTO schools (school_name, logo_url) VALUES ($1, $2) RETURNING *",
        deleteSchool: "DELETE FROM schools WHERE school_id = $1",
    },
    sections: {
        createSection: "INSERT INTO sections (course_id, section_number, section_term) VALUES ($1, $2, $3) RETURNING *",
        deleteSection: "DELETE FROM sections WHERE section_id = $1",
    },
    subjects: {
        createSubject: "INSERT INTO subjects (school_id, subject_name) VALUES ($1, $2) RETURNING *",
        deleteSubject: "DELETE FROM subjects WHERE subject_id = $1",
    },
    students: {
        deleteStudent: "DELETE FROM students WHERE student_id = $1",
        createStudent:
            "INSERT INTO students (student_id, school_id, first_name, last_name, year, faculty, major, profile_photo_url, bio) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
    },
    users: {
        createUser: "INSERT INTO users (username, password, salt, token) VALUES ($1, $2, $3, $4) RETURNING *",
        deleteUser: "DELETE FROM users WHERE user_id = $1",
    },
};

module.exports = queries;
