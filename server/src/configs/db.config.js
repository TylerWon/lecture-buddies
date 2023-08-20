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
    createStudent,
    createEnrolment,
    createInterest,
    createSocialMedia,
} = require("../../test/utils/helpers");

const init = async () => {
    await cleanUpDatabase(db);
    const user1 = await createUser(db, "won.tyler1@gmail.com", "password");
    const user2 = await createUser(db, "won.tyler2@gmail.com", "password");
    const user3 = await createUser(db, "won.tyler3@gmail.com", "password");
    const school1 = await createSchool(db, "University of British Columbia", "2023W1", "www.ubc.ca/logo.png");
    const student1 = await createStudent(
        db,
        user1.user_id,
        school1.school_id,
        "Tyler",
        "Won",
        "4th",
        "Science",
        "Computer Science",
        "https://lecture-buddies-media-files-test.s3.us-east-2.amazonaws.com/2",
        "Hello. I'm Tyler. I'm a 4th year computer science student at UBC."
    );
    const student2 = await createStudent(
        db,
        user2.user_id,
        school1.school_id,
        "Connor",
        "Won",
        "3rd",
        "Science",
        "Computer Science",
        "www.connorwon.com/profile_photo.jpg",
        "Hello. I'm Connor. I'm a 3rd year computer science student at UBC."
    );
    const student3 = await createStudent(
        db,
        user3.user_id,
        school1.school_id,
        "Brian",
        "Wu",
        "4th",
        "Science",
        "Cellular, Anatomical, and Physiological Sciences",
        "www.brianwu.com/profile_photo.jpg",
        "Hello. I'm Brian. I'm a 4th year cellular, anatomical, and physiological sciences student at UBC."
    );
    await createInterest(db, student2.student_id, "Reading");
    await createInterest(db, student2.student_id, "Swimming");
    await createSocialMedia(db, student2.student_id, "instagram", "www.instagram.com/connorwon");
    await createSocialMedia(db, student2.student_id, "facebook", "www.instagram.com/connorwon");
    const subject1 = await createSubject(db, school1.school_id, "CPSC");
    const subject2 = await createSubject(db, school1.school_id, "ENGL");
    const course1 = await createCourse(db, subject1.subject_id, "110", "Computation, Programs, and Programming");
    const course2 = await createCourse(db, subject1.subject_id, "121", "Models of Computation");
    const course3 = await createCourse(db, subject2.subject_id, "110", "Approaches to Literature and Culture");
    const section1 = await createSection(db, course1.course_id, "001", "2023W1");
    const section2 = await createSection(db, course1.course_id, "002", "2023W1");
    const section3 = await createSection(db, course2.course_id, "001", "2023W1");
    const section4 = await createSection(db, course3.course_id, "001", "2023W1");
    const section5 = await createSection(db, course1.course_id, "001", "2023W2");
    const section6 = await createSection(db, course2.course_id, "001", "2023W2");
    await createEnrolment(db, student1.student_id, section1.section_id);
    await createEnrolment(db, student1.student_id, section2.section_id);
    await createEnrolment(db, student1.student_id, section3.section_id);
    await createEnrolment(db, student3.student_id, section3.section_id);
    await createEnrolment(db, student1.student_id, section4.section_id);
    await createEnrolment(db, student2.student_id, section4.section_id);
    await createEnrolment(db, student1.student_id, section5.section_id);
    await createEnrolment(db, student2.student_id, section5.section_id);
    await createEnrolment(db, student3.student_id, section5.section_id);
    await createEnrolment(db, student1.student_id, section6.section_id);
    await createEnrolment(db, student2.student_id, section6.section_id);
    await createEnrolment(db, student3.student_id, section6.section_id);
};

init();
