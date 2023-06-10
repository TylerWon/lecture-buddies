const express = require("express");
const router = express.Router();

const studentController = require("../controllers/student.controller");
const authUtils = require("../utils/auth");

router.post("/", authUtils.authenticateRequest, studentController.createStudent);
router.get("/:student_id(\\d+)", authUtils.authenticateRequest, studentController.getStudent);
router.get("/:student_id(\\d+)/interests", authUtils.authenticateRequest, studentController.getInterestsForStudent);
router.get(
    "/:student_id(\\d+)/social-medias",
    authUtils.authenticateRequest,
    studentController.getSocialMediasForStudent
);
router.get(
    "/:student_id(\\d+)/course-history",
    authUtils.authenticateRequest,
    studentController.getCourseHistoryForStudent
);
router.get(
    "/:student_id(\\d+)/sections/:section_id(\\d+)/classmates",
    authUtils.authenticateRequest,
    studentController.getClassmatesForStudentInSection
);
router.get("/:student_id(\\d+)/buddies", authUtils.authenticateRequest, studentController.getBuddiesForStudent);
router.get(
    "/:student_id(\\d+)/buddy-requests",
    authUtils.authenticateRequest,
    studentController.getBuddyRequestsForStudent
);
router.get(
    "/:student_id(\\d+)/conversation-history",
    authUtils.authenticateRequest,
    studentController.getConversationHistoryForStudent
);

module.exports = router;
