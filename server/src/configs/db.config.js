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

// TODO: REMOVE
const { createSchool, createUser, cleanUpDatabase } = require("../../test/utils/helpers");

const init = async () => {
    await cleanUpDatabase(db);
    await createUser(db, "won.tyler1@gmail.com", "password");
    await createSchool(db, "University of British Columbia", "2023W1", "www.ubc.ca/logo.png");
};

init();
