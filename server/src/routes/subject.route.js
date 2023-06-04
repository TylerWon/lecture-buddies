const express = require("express");
const router = express.Router();

const subjectController = require("../controllers/subject.controller");

router.get("/:subject_id(\\d+)/courses", subjectController.getCoursesForSubject);

module.exports = router;
