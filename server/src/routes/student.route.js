const express = require("express");
const router = express.Router();

const studentController = require("../controllers/student.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validationMiddleware = require("../middlewares/validation.middleware");
const validationSchemas = require("../utils/validationSchemas");

router.post(
    "/",
    validationSchemas.createStudentValidationSchema(),
    validationMiddleware.validateRequest,
    authMiddleware.authenticateRequest,
    studentController.createStudent
);
router.get("/:student_id(\\d+)", authMiddleware.authenticateRequest, studentController.getStudent);
router.get(
    "/:student_id(\\d+)/interests",
    authMiddleware.authenticateRequest,
    studentController.getInterestsForStudent
);
router.get(
    "/:student_id(\\d+)/social-medias",
    authMiddleware.authenticateRequest,
    studentController.getSocialMediasForStudent
);
router.get(
    "/:student_id(\\d+)/course-history",
    validationSchemas.getCourseHistoryForStudentValidationSchema(),
    validationMiddleware.validateRequest,
    authMiddleware.authenticateRequest,
    studentController.getCourseHistoryForStudent
);
router.get(
    "/:student_id(\\d+)/sections/:section_id(\\d+)/classmates",
    validationSchemas.getClassmatesForStudentInSectionValidationSchema(),
    validationMiddleware.validateRequest,
    authMiddleware.authenticateRequest,
    studentController.getClassmatesForStudentInSection
);
router.get("/:student_id(\\d+)/buddies", authMiddleware.authenticateRequest, studentController.getBuddiesForStudent);
router.get(
    "/:student_id(\\d+)/buddy-requests",
    authMiddleware.authenticateRequest,
    studentController.getBuddyRequestsForStudent
);
router.get(
    "/:student_id(\\d+)/conversation-history",
    authMiddleware.authenticateRequest,
    studentController.getConversationHistoryForStudent
);

module.exports = router;
