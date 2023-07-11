const pgp = require("pg-promise")();
const crypto = require("crypto");

const cn = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
};

const db = pgp(cn);

module.exports = db;

// create an initial user
db.none("DELETE FROM users WHERE username = $1", "won.tyler1@gmail.com");

let salt = crypto.randomBytes(16);
db.none("INSERT INTO users (username, password, salt) VALUES ($1, $2, $3)", [
    "won.tyler1@gmail.com",
    crypto.pbkdf2Sync("password", salt, 1024, 32, "sha256"),
    salt,
]);
