// Constants
const API_URL = process.env.REACT_APP_API_URL;

/**
 * Logs a user in if they have a valid session cookie
 *
 * @returns {Promise<Response>} response from the API
 */
export const autoLogin = async () => {
    const response = await fetch(`${API_URL}/auth/autoLogin`, {
        method: "POST",
        credentials: "include",
    });

    return response;
};

/**
 * Creates an enrolment
 *
 * @param {number} values.student_id - the ID of the student to enrol in the section
 * @param {number} values.section_id - the ID of the section to enrol the student in
 *
 * @returns {Promise<Response>} response from the API
 */
export const createEnrolment = async (values) => {
    const response = await fetch(`${API_URL}/enrolments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: "include",
    });

    return response;
};

/**
 * Creates an interest
 *
 * @param {number} values.student_id - the ID of the student that likes the interest
 * @param {number} values.interest_name - the interest's name
 *
 * @returns {Promise<Response>} response from the API
 */
export const createInterest = async (values) => {
    const response = await fetch(`${API_URL}/interests`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: "include",
    });

    return response;
};

/**
 * Creates a social media
 *
 * @param {number} values.student_id - the ID of the student that the social media belongs to
 * @param {string} values.social_media_platform - the social media platform
 * @param {string} values.social_media_url - the URL of the student's profile on the platform
 *
 * @returns {Promise<Response>} response from the API
 */
export const createSocialMedia = async (values) => {
    const response = await fetch(`${API_URL}/social-medias`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: "include",
    });

    return response;
};

/**
 * Creates a student
 *
 * @param {number} values.student_id - the ID of the user associated with the student
 *
 * @returns {Promise<Response>} response from the API
 */
export const createStudent = async (values) => {
    const response = await fetch(`${API_URL}/students`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: "include",
    });

    return response;
};

/**
 * Deletes an enrolment
 *
 * @param {number} studentId - the ID of the student enrolled in the section
 * @param {number} sectionId - the ID of the section the student is enrolled in
 *
 * @returns {Promise<Response>} response from the API
 */
export const deleteEnrolment = async (studentId, sectionId) => {
    const response = await fetch(`${API_URL}/enrolments/${studentId}/${sectionId}`, {
        method: "DELETE",
        credentials: "include",
    });

    return response;
};

/**
 * Deletes an interest
 *
 * @param {number} interestId - the interest's ID
 *
 * @returns {Promise<Response>} response from the API
 */
export const deleteInterest = async (interestId) => {
    const response = await fetch(`${API_URL}/interests/${interestId}`, {
        method: "DELETE",
        credentials: "include",
    });

    return response;
};

/**
 * Deletes an interest
 *
 * @param {number} socialMediaId - the social media's ID
 *
 * @returns {Promise<Response>} response from the API
 */
export const deleteSocialMedia = async (socialMediaId) => {
    const response = await fetch(`${API_URL}/social-medias/${socialMediaId}`, {
        method: "DELETE",
        credentials: "include",
    });

    return response;
};

/**
 * Gets the courses for a subject
 *
 * @param {number} subjectId - The subject's ID
 *
 * @returns {Promise<Response>} response from the API
 */
export const getCoursesForSubject = async (subjectId) => {
    const response = await fetch(`${API_URL}/subjects/${subjectId}/courses`, {
        method: "GET",
        credentials: "include",
    });

    return response;
};

/**
 * Gets all schools
 *
 * @returns {Promise<Response>} response from the API
 */
export const getSchools = async () => {
    const response = await fetch(`${API_URL}/schools`, {
        method: "GET",
        credentials: "include",
    });

    return response;
};

/**
 * Gets a school
 *
 * @param {number} schoolId - the school's ID
 *
 * @returns {Promise<Response>} response from the API
 */
export const getSchool = async (schoolId) => {
    const response = await fetch(`${API_URL}/schools/${schoolId}`, {
        method: "GET",
        credentials: "include",
    });

    return response;
};

/**
 * Gets the sections for a course
 *
 * @param {number} courseId - The course's ID
 *
 * @returns {Promise<Response>} response from the API
 */
export const getSectionsForCourse = async (courseId) => {
    const response = await fetch(`${API_URL}/courses/${courseId}/sections`, {
        method: "GET",
        credentials: "include",
    });

    return response;
};

/**
 * Gets the subjects for a school
 *
 * @param {number} schoolId - the school's ID
 *
 * @returns {Promise<Response>} response from the API
 */
export const getSubjectsForSchool = async (schoolId) => {
    const response = await fetch(`${API_URL}/schools/${schoolId}/subjects`, {
        method: "GET",
        credentials: "include",
    });

    return response;
};

/**
 * Logs a user in
 *
 * @param {string} values.username - The user's email
 * @param {string} values.password - The user's password
 *
 * @returns {Promise<Response>} response from the API
 */
export const login = async (values) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: "include",
    });

    return response;
};

/**
 * Registers a user
 *
 * @param {string} values.username - The user's email
 * @param {string} values.password - The user's password
 *
 * @returns {Promise<Response>} response from the API
 */
export const signUp = async (values) => {
    const response = await fetch(`${API_URL}/auth/signUp`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: "include",
    });

    return response;
};

/**
 * Updates a student
 *
 * @param {number} studentId - The student's ID
 * @param {number} values.school_id - the ID of the new school the student attends
 * @param {string} values.first_name - the student's new first name
 * @param {string} values.last_name - the student's new last name
 * @param {string} values.year - the student's new year of schooling
 * @param {string} values.faculty - the student's new faculty
 * @param {string} values.major - the student's new major
 * @param {string} valuesy.profile_photo_url - the new url of the student's profile photo
 * @param {string} values.bio - the student's new bio
 *
 * @returns {Promise<Response>} response from the API
 */
export const updateStudent = async (studentId, values) => {
    const response = await fetch(`${API_URL}/students/${studentId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: "include",
    });

    return response;
};
