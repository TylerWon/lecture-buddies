const db = require("../configs/db.config");
const queries = require("../utils/queries");

/********** CONTROLLERS **********/
/**
 * Creates a student
 *
 * @param {number} req.body.student_id - the ID of the user associated with the student
 * @param {number} req.body.school_id - the ID of the school the student attends
 * @param {string} req.body.first_name - the student's first name
 * @param {string} req.body.last_name - the student's last name
 * @param {string} req.body.year - the student's year of schooling
 * @param {string} req.body.faculty - the student's faculty
 * @param {string} req.body.major - the student's major
 * @param {string} req.body.profile_photo_url - the url of the student's profile photo
 * @param {string} req.body.bio - the student's bio
 *
 * @returns
 * - 201 Created if successful
 * - 400 Bad Request if user or school does not exist or user is already associated with a student
 * - 500 Internal Server Error if unexpected error
 */
const createStudent = async (req, res, next) => {
    const payload = req.body;

    // Check if user exists
    try {
        await db.one(queries.users.getUser, [payload.student_id]);
    } catch (err) {
        return res.status(400).json({
            message: `user with id '${payload.student_id}' does not exist`,
        });
    }

    // Check if school exists
    if (!(await schoolExists(payload.school_id))) {
        return res.status(400).json({
            message: `school with id '${payload.school_id}' does not exist`,
        });
    }

    // Check if user is already associated with a student
    try {
        await db.none(queries.students.getStudent, [payload.student_id]);
    } catch (err) {
        return res.status(400).json({
            message: `user with id '${payload.user_id}' is already associated with another student`,
        });
    }

    // Create student
    try {
        const student = await db.one(queries.students.createStudent, [
            payload.student_id,
            payload.school_id,
            payload.first_name,
            payload.last_name,
            payload.year,
            payload.faculty,
            payload.major,
            payload.profile_photo_url,
            payload.bio,
        ]);
        return res.status(201).json(student);
    } catch (err) {
        return next(err); // unexpected error
    }
};

/**
 * Gets the classmates for a student in a section. Information about each classmate and their interests, social medias,
 * and mutual courses with the student for the term the section is in is included.
 *
 * @param {number} req.params.student_id - The student's ID
 * @param {number} req.params.section_id - The section's ID
 * @param {string} req.query.order_by - the field to order the response by (options: num_mutual_courses,
 * -num_mutual_courses, name, -name, year, -year, major, -major)
 * @param {string} req.query.offset - the position to start returning results from
 * @param {string} req.query.limit - the number of results to return
 *
 * @returns
 * - 200 OK if successful
 * - 400 Bad Request if student or section does not exist or student is not enrolled in section
 * - 500 Internal Server Error if unexpected error
 */
const getClassmatesForStudentInSection = async (req, res, next) => {
    const studentId = req.params.student_id;
    const sectionId = req.params.section_id;
    const orderBy = req.query.order_by;
    const offset = req.query.offset;
    const limit = req.query.limit;

    // Check if student exists
    if (!(await studentExists(studentId))) {
        return res.status(400).json({ message: `student with id '${studentId}' does not exist` });
    }

    // Check if section exists
    try {
        await db.one(queries.sections.getSection, [sectionId]);
    } catch (err) {
        return res.status(400).json({ message: `section with id '${sectionId}' does not exist` });
    }

    // Check if student is enrolled in section
    try {
        await db.one(queries.enrolments.getEnrolment, [studentId, sectionId]);
    } catch (err) {
        return res.status(400).json({
            message: `student with id '${studentId}' is not enrolled in section with id '${sectionId}'`,
        });
    }

    try {
        // Get section
        const section = await db.one(queries.sections.getSection, [sectionId]);

        // Get classmates
        let classmates = await db.any(queries.students.getClassmatesForStudentInSection, [studentId, sectionId]);

        // Get mutual courses with the student for each classmate
        await getMutualCoursesForStudentsForTerm(
            studentId,
            classmates,
            section.section_term,
            "mutual_courses_for_term"
        );

        // Sort classmates
        switch (orderBy) {
            case "num_mutual_courses":
                classmates.sort((a, b) => a.mutual_courses_for_term.length - b.mutual_courses_for_term.length);
                break;
            case "-num_mutual_courses":
                classmates.sort((a, b) => b.mutual_courses_for_term.length - a.mutual_courses_for_term.length);
                break;
            case "name":
                sortStudentsByNameASC(classmates);
                break;
            case "-name":
                sortStudentsByNameDESC(classmates);
                break;
            case "year":
                classmates.sort((a, b) => a.year.localeCompare(b.year));
                break;
            case "-year":
                classmates.sort((a, b) => b.year.localeCompare(a.year));
                break;
            case "major":
                classmates.sort((a, b) => a.major.localeCompare(b.major));
                break;
            case "-major":
                classmates.sort((a, b) => b.major.localeCompare(a.major));
                break;
        }

        // Paginate classmates
        classmates = classmates.slice(offset, offset + limit);

        // Get interests for each classmate
        await getInterestsForStudents(classmates);

        // Get social medias for each classmate
        await getSocialMediasForStudents(classmates);

        // Get friendship status for each classmate
        await getFriendshipStatusForStudents(studentId, classmates);

        return res.status(200).json(classmates);
    } catch (err) {
        return next(err); // unexpected error
    }
};

/**
 * Gets the conversations for a student. Information about the conversation, members of the conversation, and the most
 * recent message in the conversation is included.
 *
 * @param {number} req.params.student_id - The student's ID
 * @param {string} req.query.order_by - the field to order the response by (options: date, -date)
 * @param {string} req.query.offset - the position to start returning results from
 * @param {string} req.query.limit - the number of results to return
 *
 * @returns
 * - 200 OK if successful
 * - 400 Bad Request if student does not exist
 * - 500 Internal Server Error if unexpected error
 */
const getConversationsForStudent = async (req, res, next) => {
    const studentId = req.params.student_id;
    const orderBy = req.query.order_by;
    const offset = req.query.offset;
    const limit = req.query.limit;

    // Check if student exists
    if (!(await studentExists(studentId))) {
        return res.status(400).json({ message: `student with id '${studentId}' does not exist` });
    }

    try {
        // Get conversations
        let conversations = await db.any(queries.students.getConversationsForStudent, [studentId]);

        // Get members of each conversation
        await getMembersForConversations(conversations);

        // Get most recent message for each conversation
        await getMostRecentMessageForConversations(conversations);

        // Sort conversations
        switch (orderBy) {
            case "date":
                sortConversationsByDateASC(conversations);
                break;
            case "-date":
                sortConversationsByDateDESC(conversations);
                break;
        }

        // Paginate conversations
        conversations = conversations.slice(offset, offset + limit);

        return res.status(200).json(conversations);
    } catch (err) {
        console.log(err);
        return next(err); // unexpected error
    }
};

/**
 * Gets the course history for a student. The course history is all the courses a student has taken. Information about
 * the subject, course, and section is included.
 *
 * @param {number} req.params.student_id - The student's ID
 * @param {string} req.query.order_by - the field to order the response by (options: name, -name)
 *
 * @returns
 * - 200 OK if successful
 * - 400 Bad Request if student does not exist
 * - 500 Internal Server Error if unexpected error
 */
const getCourseHistoryForStudent = async (req, res, next) => {
    const studentId = req.params.student_id;
    const orderBy = req.query.order_by;

    // Check if student exists
    if (!(await studentExists(studentId))) {
        return res.status(400).json({ message: `student with id '${studentId}' does not exist` });
    }

    try {
        // Get course history
        let courseHistory = await db.any(queries.students.getCourseHistoryForStudent, [studentId]);

        // Sort course history
        switch (orderBy) {
            case "name":
                sortCoursesByNameASC(courseHistory);
                break;
            case "-name":
                sortCoursesByNameDESC(courseHistory);
                break;
        }

        return res.status(200).json(courseHistory);
    } catch (err) {
        return next(err); // unexpected error
    }
};

/**
 * Gets the friends for a student. Information about the friend and their interests and social medias is included. If
 * the friendship status is 'accepted', information about the friends' current/previous mutual courses with the student
 * is included. Otherwise, only information about the friends' current mutual courses with the student is included
 *
 * @param {number} req.params.student_id - the student's ID
 * @param {string} req.query.status - the friendship status of the friends to get (options: pending, accepted, declined)
 * @param {string} req.query.order_by - the field to order the response by (options: name, -name)
 * @param {string} req.query.offset - the position to start returning results from
 * @param {string} req.query.limit - the number of results to return
 *
 * @returns
 * - 200 OK if successful
 * - 400 Bad Request if student does not exist
 * - 500 Internal Server Error if unexpected error
 */
const getFriendsForStudent = async (req, res, next) => {
    const studentId = req.params.student_id;
    const status = req.query.status;
    const orderBy = req.query.order_by;
    const offset = req.query.offset;
    const limit = req.query.limit;

    // Check if student exists
    if (!(await studentExists(studentId))) {
        return res.status(400).json({ message: `student with id '${studentId}' does not exist` });
    }

    try {
        let friends;

        // Get friends based on status
        switch (status) {
            case "pending":
                friends = await db.any(queries.students.getFriendsForStudent, [studentId, status]);
                break;
            case "accepted":
                friends = await db.any(queries.students.getFriendsForStudent, [studentId, status]);
                break;
            case "declined":
                friends = await db.any(queries.students.getFriendsForStudent, [studentId, status]);
                break;
        }

        // Sort friends
        switch (orderBy) {
            case "name":
                sortStudentsByNameASC(friends);
                break;
            case "-name":
                sortStudentsByNameDESC(friends);
                break;
        }

        // Paginate friends
        friends = friends.slice(offset, offset + limit);

        // Get interests for each friend
        await getInterestsForStudents(friends);

        // Get social medias for each friend
        await getSocialMediasForStudents(friends);

        // Get school
        const student = await db.one(queries.students.getStudent, [studentId]);
        const school = await db.one(queries.schools.getSchool, [student.school_id]);

        // Get current mutual courses with the student for each friend
        await getMutualCoursesForStudentsForTerm(studentId, friends, school.current_term, "current_mutual_courses");

        // Get previous mutual courses with the student for each friend if status is 'accepted'
        if (status === "accepted") {
            await getMutualCoursesForStudentsExcludingTerm(
                studentId,
                friends,
                school.current_term,
                "previous_mutual_courses"
            );
        }

        return res.status(200).json(friends);
    } catch (err) {
        return next(err); // unexpected error
    }
};

/**
 * Gets the interests for a student
 *
 * @param {number} req.params.student_id - The student's ID
 *
 * @returns
 * - 200 OK if successful
 * - 400 Bad Request if student does not exist
 * - 500 Internal Server Error if unexpected error
 */
const getInterestsForStudent = async (req, res, next) => {
    const studentId = req.params.student_id;

    // Check if student exists
    if (!(await studentExists(studentId))) {
        return res.status(400).json({ message: `student with id '${studentId}' does not exist` });
    }

    // Get interests
    try {
        const interests = await db.any(queries.students.getInterestsForStudent, [studentId]);
        return res.status(200).json(interests);
    } catch (err) {
        return next(err); // unexpected error
    }
};

/**
 * Gets the social medias for a student
 *
 * @param {number} req.params.student_id - The student's ID
 *
 * @returns
 * - 200 OK if successful
 * - 400 Bad Request if student does not exist
 * - 500 Internal Server Error if unexpected error
 */
const getSocialMediasForStudent = async (req, res, next) => {
    const studentId = req.params.student_id;

    // Check if student exists
    if (!(await studentExists(studentId))) {
        return res.status(400).json({ message: `student with id '${studentId}' does not exist` });
    }

    // Get social medias
    try {
        const socialMedias = await db.any(queries.students.getSocialMediasForStudent, [studentId]);
        return res.status(200).json(socialMedias);
    } catch (err) {
        return next(err); // unexpected error
    }
};

/**
 * Gets a student
 *
 * @param {number} req.params.student_id - The student's ID
 *
 * @returns
 * - 200 OK if successful
 * - 400 Bad Request if student does not exist
 * - 500 Internal Server Error if unexpected error
 */
const getStudent = async (req, res, next) => {
    const studentId = req.params.student_id;

    // Check if student exists
    if (!(await studentExists(studentId))) {
        return res.status(400).json({ message: `student with id '${studentId}' does not exist` });
    }

    // Get student
    try {
        const student = await db.one(queries.students.getStudent, [studentId]);
        return res.status(200).json(student);
    } catch (err) {
        return next(err); // unexpected error
    }
};

/**
 * Updates a student
 *
 * @param {number} req.params.student_id - The student's ID
 * @param {number} req.body.school_id - the ID of the new school the student attends
 * @param {string} req.body.first_name - the student's new first name
 * @param {string} req.body.last_name - the student's new last name
 * @param {string} req.body.year - the student's new year of schooling
 * @param {string} req.body.faculty - the student's new faculty
 * @param {string} req.body.major - the student's new major
 * @param {string} req.body.profile_photo_url - the new url of the student's profile photo
 * @param {string} req.body.bio - the student's new bio
 *
 * @returns
 * - 200 OK if successful
 * - 400 Bad Request if student or school does not exist
 * - 500 Internal Server Error if unexpected error
 */
const updateStudent = async (req, res, next) => {
    const studentId = req.params.student_id;
    const payload = req.body;

    // Check if student exists
    if (!(await studentExists(studentId))) {
        return res.status(400).json({ message: `student with id '${studentId}' does not exist` });
    }

    // Check if school exists
    if (!(await schoolExists(payload.school_id))) {
        return res.status(400).json({
            message: `school with id '${payload.school_id}' does not exist`,
        });
    }

    // Update student
    try {
        const student = await db.one(queries.students.updateStudent, [
            payload.school_id,
            payload.first_name,
            payload.last_name,
            payload.year,
            payload.faculty,
            payload.major,
            payload.profile_photo_url,
            payload.bio,
            studentId,
        ]);
        return res.status(200).json(student);
    } catch (err) {
        return next(err); // unexpected error
    }
};

/********** HELPERS **********/
/**
 * Gets the friendship status for every student in an array of students with a given student
 *
 * @param {number} studentId - the student's ID
 * @param {object[]} students - the array of students to get the friendship status for
 */
const getFriendshipStatusForStudents = async (studentId, students) => {
    for (const student of students) {
        const friendship = await db.oneOrNone(queries.friendships.getFriendship, [studentId, student.student_id]);

        if (friendship) {
            student.friendship_status = friendship.friendship_status;
        } else {
            student.friendship_status = "none";
        }
    }
};

/**
 * Gets the interests for every student in an array of students
 *
 * @param {object[]} students - the array of students to get interests for
 */
const getInterestsForStudents = async (students) => {
    for (const student of students) {
        student.interests = await db.any(queries.students.getInterestsForStudent, [student.student_id]);
    }
};

/**
 * Gets the members of a conversation for every conversation in an array of conversations
 *
 * @param {object[]} conversations - the array of conversations to get members for
 */
const getMembersForConversations = async (conversations) => {
    for (const conversation of conversations) {
        conversation.conversation_members = await db.any(queries.conversations.getMembersForConversation, [
            conversation.conversation_id,
        ]);
    }
};

/**
 * Gets the most recent message for every conversation in an array of conversations
 *
 * @param {object[]} conversations - the array of conversations to get the most recent message for
 */
const getMostRecentMessageForConversations = async (conversations) => {
    for (const conversation of conversations) {
        conversation.most_recent_message = await db.one(queries.conversations.getMostRecentMessageForConversation, [
            conversation.conversation_id,
        ]);
    }
};

/**
 * Gets the mutual courses every student in an array of students has with another student for a term and sorts them by
 * name in ascending order
 *
 * @param {number} studentId - the ID of the student to check every student in the array of students against for
 * mutual courses
 * @param {object[]} students - the array of students to get mutual courses for
 * @param {string} term - the term to get mutual courses for
 * @param {string} field - the name of the field to store the mutual courses in for each student
 */
const getMutualCoursesForStudentsForTerm = async (studentId, students, term, field) => {
    for (const student of students) {
        student[field] = await db.any(queries.students.getMutualCoursesForTwoStudentsForTerm, [
            studentId,
            student.student_id,
            term,
        ]);
        sortCoursesByNameASC(student[field]);
    }
};

/**
 * Gets the mutual courses every student in an array of students has with another student for all terms besides a
 * specified term and sorts them by name in ascending order
 *
 * @param {number} studentId - the ID of the student to check every student in the array of students against for
 * mutual courses
 * @param {object[]} students - the array of students to get mutual courses for
 * @param {string} term - the term to exclude from getting mutual courses
 * @param {string} field - the name of the field to store the mutual courses in for each student
 */
const getMutualCoursesForStudentsExcludingTerm = async (studentId, students, term, field) => {
    for (const student of students) {
        student[field] = await db.any(queries.students.getMutualCoursesForTwoStudentsExcludingTerm, [
            studentId,
            student.student_id,
            term,
        ]);
        sortCoursesByNameASC(student[field]);
    }
};

/**
 * Gets the social medias for every student in an array of students
 *
 * @param {object[]} students - the array of students to get social medias for
 */
const getSocialMediasForStudents = async (students) => {
    for (const student of students) {
        student.social_medias = await db.any(queries.students.getSocialMediasForStudent, [student.student_id]);
    }
};

/**
 * Sorts an array of conversations by date in ascending order
 *
 * @param {object[]} conversations - the array of conversations to sort
 */
const sortConversationsByDateASC = (conversations) => {
    conversations.sort((a, b) => a.most_recent_message.sent_datetime - b.most_recent_message.sent_datetime);
};

/**
 * Sorts an array of conversations by date in descending order
 *
 * @param {object[]} conversations - the array of conversations to sort
 */
const sortConversationsByDateDESC = (conversations) => {
    conversations.sort((a, b) => b.most_recent_message.sent_datetime - a.most_recent_message.sent_datetime);
};

/**
 * Sorts an array of courses by name in ascending order
 *
 * @param {object[]} courses - the array of courses to sort
 */
const sortCoursesByNameASC = (courses) => {
    courses.sort(
        (a, b) =>
            a.subject_name.localeCompare(b.subject_name) ||
            a.course_number.localeCompare(b.course_number) ||
            a.course_name.localeCompare(b.course_name) ||
            a.section_number.localeCompare(b.section_number)
    );
};

/**
 * Sorts an array of courses by name in descending order
 *
 * @param {object[]} courses - the array of courses to sort
 */
const sortCoursesByNameDESC = (courses) => {
    courses.sort(
        (a, b) =>
            b.subject_name.localeCompare(a.subject_name) ||
            b.course_number.localeCompare(a.course_number) ||
            b.course_name.localeCompare(a.course_name) ||
            b.section_number.localeCompare(a.section_number)
    );
};

/**
 * Sorts an array of students by name in ascending order
 *
 * @param {object[]} students - the array of students to sort
 */
const sortStudentsByNameASC = (students) => {
    students.sort((a, b) => {
        const aName = `${a.first_name} ${a.last_name}`;
        const bName = `${b.first_name} ${b.last_name}`;
        return aName.localeCompare(bName);
    });
};

/**
 * Sorts an array of students by name in descending order
 *
 * @param {object[]} students - the array of students to sort
 */
const sortStudentsByNameDESC = (students) => {
    students.sort((a, b) => {
        const aName = `${a.first_name} ${a.last_name}`;
        const bName = `${b.first_name} ${b.last_name}`;
        return bName.localeCompare(aName);
    });
};

/**
 * Checks if a school exists
 *
 * @param {number} schoolId - the school's ID
 *
 * @returns
 * - true if the school exists
 * - false if the school does not exist
 */
const schoolExists = async (schoolId) => {
    try {
        await db.one(queries.schools.getSchool, [schoolId]);
        return true;
    } catch (err) {
        return false;
    }
};

/**
 * Checks if a student exists
 *
 * @param {number} studentId - the student's ID
 *
 * @returns
 * - true if the student exists
 * - false if the student does not exist
 */
const studentExists = async (studentId) => {
    try {
        await db.one(queries.students.getStudent, [studentId]);
        return true;
    } catch (err) {
        return false;
    }
};

module.exports = {
    createStudent,
    getClassmatesForStudentInSection,
    getConversationsForStudent,
    getCourseHistoryForStudent,
    getFriendsForStudent,
    getInterestsForStudent,
    getSocialMediasForStudent,
    getStudent,
    updateStudent,
};
