// Constants
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Logs a user in if they have a valid session cookie
export const autoLogin = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/autologin`, {
        method: "POST",
        credentials: "include",
    });

    return response;
};

// Creates a new interest
export const createInterest = async (values) => {
    const response = await fetch(`${API_BASE_URL}/interests`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            student_id: values.student_id,
            interest_name: values.interest,
        }),
        credentials: "include",
    });

    return response;
};

// Creates a social media
export const createSocialMedia = async (values) => {
    const response = await fetch(`${API_BASE_URL}/social-medias`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            student_id: values.student_id,
            social_media_platform: values.platform,
            social_media_url: values.url,
        }),
        credentials: "include",
    });

    return response;
};

// Creates a new student
export const createStudent = async (values) => {
    const response = await fetch(`${API_BASE_URL}/students`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            student_id: values.user_id,
        }),
        credentials: "include",
    });

    return response;
};

// Creates a new user
export const createUser = async (values) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
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
