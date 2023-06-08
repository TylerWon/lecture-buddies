const express = require("express");
const router = express.Router();

const courseController = require("../controllers/course.controller");
const authUtils = require("../utils/auth");

router.get("/:course_id(\\d+)/sections", authUtils.authenticateRequest, courseController.getSectionsForCourse);

module.exports = router;
