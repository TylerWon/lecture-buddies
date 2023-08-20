const queries = {
    conversations: {
        getMostRecentMessageForConversation: `
            SELECT *
            FROM messages
            WHERE conversation_id = $1
            ORDER BY sent_datetime DESC
            LIMIT 1
        `,
        createConversation: `
            INSERT INTO conversations (student_id_1, student_id_2)
            VALUES ($1, $2)
            RETURNING *
        `,
        getConversation: `
            SELECT *
            FROM conversations
            WHERE conversation_id = $1
        `,
        getMessagesForConversation: `
            SELECT *
            FROM messages
            WHERE conversation_id = $1
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
            WHERE course_id = $1 AND section_term = $2
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
        deleteEnrolment: `
            DELETE FROM enrolments
            WHERE student_id = $1 AND section_id = $2
        `,
    },
    friendships: {
        getFriendship: `
            SELECT *
            FROM friendships
            WHERE requestor_id = $1 AND requestee_id = $2 OR requestor_id = $2 AND requestee_id = $1
        `,
        createFriendship: `
            INSERT INTO friendships (requestor_id, requestee_id)
            VALUES ($1, $2)
            RETURNING *
        `,
    },
    interests: {
        createInterest: `
            INSERT INTO interests (student_id, interest_name)
            VALUES ($1, $2)
            RETURNING *
        `,
        getInterest: `
            SELECT *
            FROM interests
            WHERE interest_id = $1
        `,
        deleteInterest: `
            DELETE FROM interests
            WHERE interest_id = $1
        `,
    },
    messages: {
        createMessage: `
            INSERT INTO messages (conversation_id, author_id, message_content)
            VALUES ($1, $2, $3)
            RETURNING *
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
        getSectionDetails: `
            SELECT subjects.school_id, subjects.subject_id, subjects.subject_name, courses.course_id, courses.course_number, courses.course_name, sections.section_id, sections.section_number, sections.section_term
            FROM sections
            JOIN courses ON sections.course_id = courses.course_id 
            JOIN subjects ON courses.subject_id = subjects.subject_id 
            WHERE section_id = $1
        `,
    },
    socialMedias: {
        createSocialMedia: `
            INSERT INTO social_medias (student_id, social_media_platform, social_media_url)
            VALUES ($1, $2, $3)
            RETURNING *
        `,
        getSocialMedia: `
            SELECT *
            FROM social_medias
            WHERE social_media_id = $1
        `,
        deleteSocialMedia: `
            DELETE FROM social_medias
            WHERE social_media_id = $1
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
            INSERT INTO students (student_id) 
            VALUES ($1) 
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
        getFriendsForStudent: `
            SELECT students.student_id, students.school_id, students.first_name, students.last_name, students.year, students.faculty, students.major, students.profile_photo_url, students.bio, friendships.friendship_status
            FROM friendships
            JOIN students ON friendships.requestee_id = students.student_id
            WHERE friendships.requestor_id = $1 AND friendships.friendship_status = $2
            UNION
            SELECT students.student_id, students.school_id, students.first_name, students.last_name, students.year, students.faculty, students.major, students.profile_photo_url, students.bio, friendships.friendship_status
            FROM friendships
            JOIN students ON friendships.requestor_id = students.student_id
            WHERE friendships.requestee_id = $1 AND friendships.friendship_status = $2
        `,
        getConversationsForStudent: `
            SELECT *
            FROM conversations
            WHERE student_id_1 = $1 OR student_id_2 = $1
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
            INSERT INTO users (username, password, salt) 
            VALUES ($1, $2, $3) 
            RETURNING *
        `,
        deleteUser: `
            DELETE FROM users
            WHERE user_id = $1
        `,
    },
};

module.exports = queries;
