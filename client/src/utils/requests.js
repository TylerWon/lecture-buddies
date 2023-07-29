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

// Deletes an interest
export const deleteInterest = async (interestId) => {
    const response = await fetch(`${API_BASE_URL}/interests/${interestId}`, {
        method: "DELETE",
        credentials: "include",
    });

    return response;
};

// Deletes a social media
export const deleteSocialMedia = async (socialMediaId) => {
    const response = await fetch(`${API_BASE_URL}/social-medias/${socialMediaId}`, {
        method: "DELETE",
        credentials: "include",
    });

    return response;
};

// Gets schools
export const getSchools = async () => {
    const response = await fetch(`${API_BASE_URL}/schools`, {
        method: "GET",
        credentials: "include",
    });

    return response;
};

// Logs a user in
export const login = async (values) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: values.email,
            password: values.password,
        }),
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

// Updates a student
export const updateStudent = async (userId, values) => {
    const response = await fetch(`${API_BASE_URL}/students/${userId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            school_id: values.school,
            year: values.year,
            faculty: values.faculty,
            major: values.major,
        }),
        credentials: "include",
    });

    return response;
};
