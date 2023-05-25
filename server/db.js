const pgp = require('pg-promise')();

const cn = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
};

const db = pgp(cn);

module.exports = db;
