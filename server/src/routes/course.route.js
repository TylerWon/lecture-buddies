const express = require("express");
const router = express.Router();

const courseController = require("../controllers/course.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validationMiddleware = require("../middlewares/validation.middleware");
const validationSchemas = require("../utils/validationSchemas");

router.get(
    "/:course_id(\\d+)/sections",
    validationSchemas.getSectionsForCourseValidationSchema(),
    validationMiddleware.validateRequest,
    authMiddleware.authenticateRequest,
    courseController.getSectionsForCourse
);

module.exports = router;
