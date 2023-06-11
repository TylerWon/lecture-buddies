const express = require("express");
const router = express.Router();

const subjectController = require("../controllers/subject.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/:subject_id(\\d+)/courses", authMiddleware.authenticateRequest, subjectController.getCoursesForSubject);

module.exports = router;
