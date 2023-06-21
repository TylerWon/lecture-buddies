const queries = {
    conversations: {
        getMostRecentMessageForConversation: `
            SELECT *
            FROM messages
            WHERE conversation_id = $1
            ORDER BY sent_datetime DESC
            LIMIT 1
        `,
        getMembersForConversation: `
            SELECT students.student_id, students.school_id, students.first_name, students.last_name, students.year, students.faculty, students.major, students.profile_photo_url, students.bio
            FROM conversation_members
            JOIN students ON conversation_members.student_id = students.student_id
            WHERE conversation_members.conversation_id = $1
        `,
    },
    courses: {
        getCourse: `
            SELECT *
            FROM courses
            WHERE course_id = $1
        `,
        getSectionsForCourse: `
            SELECT * 
            FROM sections 
            WHERE course_id = $1
        `,
    },
    enrolments: {
        createEnrolment: `
            INSERT INTO enrolments (student_id, section_id) 
            VALUES ($1, $2) 
            RETURNING *
        `,
        getEnrolment: `
            SELECT *
            FROM enrolments
            WHERE student_id = $1 AND section_id = $2
        `,
    },
    schools: {
        getSchools: `
            SELECT * 
            FROM schools
        `,
        getSchool: `
            SELECT * 
            FROM schools 
            WHERE school_id = $1
        `,
        getSubjectsForSchool: `
            SELECT * 
            FROM subjects 
            WHERE school_id = $1
        `,
    },
    sections: {
        getSection: `
            SELECT *
            FROM sections
            WHERE section_id = $1
        `,
    },
    subjects: {
        getSubject: `
            SELECT *
            FROM subjects
            WHERE subject_id = $1    
        `,
        getCoursesForSubject: `
            SELECT * 
            FROM courses 
            WHERE subject_id = $1
        `,
    },
    students: {
        createStudent: `
            INSERT INTO students (student_id, school_id, first_name, last_name, year, faculty, major, profile_photo_url, bio) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
            RETURNING *
        `,
        getStudent: `
            SELECT * 
            FROM students 
            WHERE student_id = $1
        `,
        getInterestsForStudent: `
            SELECT * 
            FROM interests 
            WHERE student_id = $1
        `,
        getSocialMediasForStudent: `
            SELECT * 
            FROM social_medias 
            WHERE student_id = $1
        `,
        getCourseHistoryForStudent: `
            SELECT subjects.school_id, subjects.subject_id, subjects.subject_name, courses.course_id, courses.course_number, courses.course_name, sections.section_id, sections.section_number, sections.section_term
            FROM enrolments
            JOIN sections ON enrolments.section_id = sections.section_id 
            JOIN courses ON sections.course_id = courses.course_id 
            JOIN subjects ON courses.subject_id = subjects.subject_id 
            WHERE enrolments.student_id = $1 
        `,
        getClassmatesForStudentInSection: `
            SELECT students.student_id, students.school_id, students.first_name, students.last_name, students.year, students.faculty, students.major, students.profile_photo_url, students.bio
            FROM enrolments
            JOIN students ON enrolments.student_id = students.student_id
            WHERE enrolments.student_id != $1 AND enrolments.section_id = $2
        `,
        getMutualCoursesForTwoStudentsForTerm: `
            SELECT subjects.school_id, subjects.subject_id, subjects.subject_name, courses.course_id, courses.course_number, courses.course_name, sections.section_id, sections.section_number, sections.section_term
            FROM enrolments
            JOIN sections ON enrolments.section_id = sections.section_id 
            JOIN courses ON sections.course_id = courses.course_id 
            JOIN subjects ON courses.subject_id = subjects.subject_id 
            WHERE enrolments.student_id = $1 AND sections.section_term = $3 AND enrolments.section_id IN (
                SELECT enrolments.section_id
                FROM enrolments
                WHERE enrolments.student_id = $2
            )
        `,
        getMutualCoursesForTwoStudentsExcludingTerm: `
            SELECT subjects.school_id, subjects.subject_id, subjects.subject_name, courses.course_id, courses.course_number, courses.course_name, sections.section_id, sections.section_number, sections.section_term
            FROM enrolments
            JOIN sections ON enrolments.section_id = sections.section_id 
            JOIN courses ON sections.course_id = courses.course_id 
            JOIN subjects ON courses.subject_id = subjects.subject_id 
            WHERE enrolments.student_id = $1 AND sections.section_term != $3 AND enrolments.section_id IN (
                SELECT enrolments.section_id
                FROM enrolments
                WHERE enrolments.student_id = $2
            )
        `,
        getBuddiesOrBuddyRequestsForStudent: `
            SELECT students.student_id, students.school_id, students.first_name, students.last_name, students.year, students.faculty, students.major, students.profile_photo_url, students.bio
            FROM buddies
            JOIN students ON buddies.requestee_id = students.student_id
            WHERE buddies.requestor_id = $1 AND buddies.status = $2
            UNION
            SELECT students.student_id, students.school_id, students.first_name, students.last_name, students.year, students.faculty, students.major, students.profile_photo_url, students.bio
            FROM buddies
            JOIN students ON buddies.requestor_id = students.student_id
            WHERE buddies.requestee_id = $1 AND buddies.status = $2
        `,
        getBuddyRequestsForStudent: `
            SELECT students.student_id, students.school_id, students.first_name, students.last_name, students.year, students.faculty, students.major, students.profile_photo_url, students.bio
            FROM buddies
            JOIN students ON buddies.requestee_id = students.student_id
            WHERE buddies.requestor_id = $1 AND buddies.status = $2
            UNION
            SELECT students.student_id, students.school_id, students.first_name, students.last_name, students.year, students.faculty, students.major, students.profile_photo_url, students.bio
            FROM buddies
            JOIN students ON buddies.requestor_id = students.student_id
            WHERE buddies.requestee_id = $1 AND buddies.status = $2
        `,
        getConversationsForStudent: `
            SELECT conversations.conversation_id, conversations.conversation_name
            FROM conversation_members
            JOIN conversations ON conversation_members.conversation_id = conversations.conversation_id
            WHERE conversation_members.student_id = $1
        `,
    },
    users: {
        getUser: `
            SELECT * 
            FROM users 
            WHERE user_id = $1
        `,
        getUserByUsername: `
            SELECT * 
            FROM users 
            WHERE username = $1
        `,
        createUser: `
            INSERT INTO users (username, password, salt, token) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *
        `,
    },
};

module.exports = queries;
