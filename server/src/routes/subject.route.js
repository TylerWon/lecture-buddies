const express = require("express");
const router = express.Router();

const subjectController = require("../controllers/subject.controller");
const authUtils = require("../utils/auth");

router.get("/:subject_id(\\d+)/courses", authUtils.authenticateRequest, subjectController.getCoursesForSubject);

module.exports = router;
