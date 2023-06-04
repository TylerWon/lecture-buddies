const express = require("express");
const router = express.Router();

const courseController = require("../controllers/course.controller");

router.get("/:course_id(\\d+)/sections", courseController.getSectionsForCourse);

module.exports = router;
