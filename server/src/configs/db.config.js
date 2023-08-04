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
const {
    createCourse,
    createSchool,
    createSection,
    createSubject,
    createUser,
    cleanUpDatabase,
} = require("../../test/utils/helpers");

const init = async () => {
    await cleanUpDatabase(db);
    await createUser(db, "won.tyler1@gmail.com", "password");
    const school1 = await createSchool(db, "University of British Columbia", "2023W1", "www.ubc.ca/logo.png");
    const subject1 = await createSubject(db, school1.school_id, "CPSC");
    const subject2 = await createSubject(db, school1.school_id, "ENGL");
    const course1 = await createCourse(db, subject1.subject_id, "110", "Computation, Programs, and Programming");
    const course2 = await createCourse(db, subject1.subject_id, "121", "Models of Computation");
    const course3 = await createCourse(db, subject2.subject_id, "110", "Approaches to Literature and Culture");
    const section1 = await createSection(db, course1.course_id, "001", "2023W1");
    const section2 = await createSection(db, course1.course_id, "002", "2023W1");
    const section3 = await createSection(db, course2.course_id, "001", "2023W1");
    const section4 = await createSection(db, course3.course_id, "001", "2023W1");
};

init();
