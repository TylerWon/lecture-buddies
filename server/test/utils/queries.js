const queries = {
    schools: {
        createSchool: "INSERT INTO schools (school_name, logo_url) VALUES ($1, $2) RETURNING *",
        deleteSchool: "DELETE FROM schools WHERE school_id = $1",
    },
    subjects: {
        createSubject: "INSERT INTO subjects (school_id, subject_name) VALUES ($1, $2) RETURNING *",
        deleteSubject: "DELETE FROM subjects WHERE subject_id = $1",
    },
    courses: {
        createCourse: "INSERT INTO courses (subject_id, course_number, course_name) VALUES ($1, $2, $3) RETURNING *",
        deleteCourse: "DELETE FROM courses WHERE course_id = $1",
    },
};

module.exports = queries;
