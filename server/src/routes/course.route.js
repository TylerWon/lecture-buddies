const express = require("express");
const router = express.Router();

const courseController = require("../controllers/course.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/:course_id(\\d+)/sections", authMiddleware.authenticateRequest, courseController.getSectionsForCourse);

module.exports = router;
