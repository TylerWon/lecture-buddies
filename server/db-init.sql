-- Prerequsites: Install postgresql
-- 
-- This script creates a database called "lecture_buddies" and creates the tables for it
-- To execute this script, run the command: psql -U postgres -a -f ./db-init.sql
-- 
-- Note: Any database roles with permissions to the lecture_buddies database will need to be regranted permissions after running this script

DROP DATABASE IF EXISTS lecture_buddies;
CREATE DATABASE lecture_buddies;

\c lecture_buddies postgres

CREATE TABLE schools (
	school_id SERIAL PRIMARY KEY,
	school_name VARCHAR(150) UNIQUE,
	logo_url VARCHAR(2048)
);

CREATE TABLE subjects (
	subject_id SERIAL PRIMARY KEY,
	school_id INTEGER,
	subject_name VARCHAR(10),
	FOREIGN KEY (school_id) REFERENCES schools
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE courses (
	course_id SERIAL PRIMARY KEY,
    subject_id INTEGER,
    course_number VARCHAR(10),
	course_name VARCHAR(150),
	FOREIGN KEY (subject_id) REFERENCES subjects
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE sections (
	section_id SERIAL PRIMARY KEY,
	course_id INTEGER,
	section_number VARCHAR(10),
	section_term VARCHAR(10),
	FOREIGN KEY (course_id) REFERENCES courses
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE users (
	user_id SERIAL PRIMARY KEY,
	username VARCHAR(254) UNIQUE,
	password BYTEA,
	salt BYTEA,
	token VARCHAR(250)
);

CREATE TABLE students (
	student_id INTEGER PRIMARY KEY,
	school_id INTEGER,
	first_name VARCHAR(50),
	last_name VARCHAR(50),
	year VARCHAR(2),
	faculty VARCHAR(150),
	major VARCHAR(150),
	profile_photo_url VARCHAR(2048),
	bio VARCHAR(500),
	FOREIGN KEY (school_id) REFERENCES schools
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY (student_id) REFERENCES users(user_id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE enrols (
	student_id INTEGER,
	section_id INTEGER,
	PRIMARY KEY (student_id, section_id),
	FOREIGN KEY (student_id) REFERENCES students
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY (section_id) REFERENCES sections
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE interests (
	interest_id SERIAL PRIMARY KEY,
	interest_name VARCHAR(50) UNIQUE
);

CREATE TABLE likes (
	student_id INTEGER,
	interest_id INTEGER,
	FOREIGN KEY (student_id) REFERENCES students
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY (interest_id) REFERENCES interests
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TYPE PLATFORM AS ENUM ('Facebook', 'Instagram', 'LinkedIn', 'Twitter');

CREATE TABLE social_medias (
	social_media_id SERIAL PRIMARY KEY,  
	student_id INTEGER,
    platform PLATFORM,
    url VARCHAR(2048),
    FOREIGN KEY (student_id) REFERENCES students
	    ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE conversations (
	conversation_id SERIAL PRIMARY KEY,
	conversation_name CHAR(150)
);

CREATE TABLE conversation_members (
	conversation_id INTEGER,
	student_id INTEGER,
	PRIMARY KEY (conversation_id, student_id),
    FOREIGN KEY (conversation_id) REFERENCES conversations
	    ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY (student_id) REFERENCES students
	    ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE messages (
	message_id SERIAL PRIMARY KEY,
	conversation_id INTEGER,
	author_id INTEGER,
	message_content TEXT,
	sent_datetime TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (conversation_id) REFERENCES conversations
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY (author_id) REFERENCES students(student_id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TYPE STATUS AS ENUM ('pending', 'accepted', 'declined');

CREATE TABLE buddies (
	requestor_id INTEGER,
	requestee_id INTEGER,
	status STATUS DEFAULT 'pending',
	created_datetime TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	updated_datetime TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (requestor_id, requestee_id),
	FOREIGN KEY (requestor_id) REFERENCES students(student_id)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY (requestee_id) REFERENCES students(student_id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);
