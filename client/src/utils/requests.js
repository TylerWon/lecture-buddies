// Constants
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * Logs a user in if they have a valid session cookie
 *
 * @returns {Promise<Response>} response from the API
 */
export const autoLogin = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/autologin`, {
        method: "POST",
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
    const response = await fetch(`${API_BASE_URL}/interests`, {
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
    const response = await fetch(`${API_BASE_URL}/social-medias`, {
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
    const response = await fetch(`${API_BASE_URL}/students`, {
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
 * Deletes an interest
 *
 * @param {number} interestId - the interest's ID
 *
 * @returns {Promise<Response>} response from the API
 */
export const deleteInterest = async (interestId) => {
    const response = await fetch(`${API_BASE_URL}/interests/${interestId}`, {
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
    const response = await fetch(`${API_BASE_URL}/social-medias/${socialMediaId}`, {
        method: "DELETE",
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
    const response = await fetch(`${API_BASE_URL}/schools`, {
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
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
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
export const signup = async (values) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
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
 * @param {number} userId - The student's ID
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
export const updateStudent = async (userId, values) => {
    const response = await fetch(`${API_BASE_URL}/students/${userId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: "include",
    });

    return response;
};
