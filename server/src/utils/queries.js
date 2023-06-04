const queries = {
    users: {
        getUserByUsername: "SELECT * FROM users WHERE username = $1",
        createUser: "INSERT INTO users (username, password, salt, token) VALUES ($1, $2, $3, $4) RETURNING *",
    },
    schools: {
        getSchools: "SELECT * FROM schools",
        getSubjectsForSchool: "SELECT * FROM subjects WHERE school_id = $1",
    },
};

module.exports = queries;
