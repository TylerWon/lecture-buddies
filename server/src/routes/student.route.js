const express = require("express");
const router = express.Router();

const studentController = require("../controllers/student.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/", authMiddleware.authenticateRequest, studentController.createStudent);
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
    authMiddleware.authenticateRequest,
    studentController.getCourseHistoryForStudent
);
router.get(
    "/:student_id(\\d+)/sections/:section_id(\\d+)/classmates",
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
