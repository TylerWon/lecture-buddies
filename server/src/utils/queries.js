const queries = {
    users: {
        getUser: "SELECT * FROM users WHERE username = $1",
        createUser: "INSERT INTO users (username, password, salt) VALUES ($1, $2, $3) RETURNING *",
    },
};

module.exports = queries;
