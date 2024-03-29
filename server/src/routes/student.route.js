const express = require("express");
const router = express.Router();

const studentController = require("../controllers/student.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validationMiddleware = require("../middlewares/validation.middleware");
const validationSchemas = require("../utils/validationSchemas");

router.get("/:student_id(\\d+)", authMiddleware.authenticateRequest, studentController.getStudent);
router.patch(
    "/:student_id(\\d+)",
    validationSchemas.updateStudentValidationSchema(),
    validationMiddleware.validateRequest,
    authMiddleware.authenticateRequest,
    studentController.updateStudent
);
router.get(
    "/:student_id(\\d+)/friends",
    validationSchemas.getFriendsForStudentValidationSchema(),
    validationSchemas.sortingAndPaginationValidationSchema(
        [/^(-?)(name)$/],
        "order_by must be one of 'name' or '-name'"
    ),
    validationMiddleware.validateRequest,
    authMiddleware.authenticateRequest,
    studentController.getFriendsForStudent
);
router.get(
    "/:student_id(\\d+)/conversations",
    validationSchemas.sortingAndPaginationValidationSchema(
        [/^(-?)(date)$/],
        "order_by must be one of 'date' or '-date'"
    ),
    validationMiddleware.validateRequest,
    authMiddleware.authenticateRequest,
    studentController.getConversationsForStudent
);
router.get(
    "/:student_id(\\d+)/course-history",
    validationSchemas.getCourseHistoryForStudentValidationSchema(),
    validationMiddleware.validateRequest,
    authMiddleware.authenticateRequest,
    studentController.getCourseHistoryForStudent
);
router.get(
    "/:student_id(\\d+)/interests",
    authMiddleware.authenticateRequest,
    studentController.getInterestsForStudent
);
router.get(
    "/:student_id(\\d+)/sections/:section_id(\\d+)/classmates",
    validationSchemas.sortingAndPaginationValidationSchema(
        [/^(-?)(num_mutual_courses|name|year|major)$/],
        "order_by must be one of 'num_mutual_courses', '-num_mutual_courses', 'name', '-name', 'year', '-year', 'major', '-major''"
    ),
    validationMiddleware.validateRequest,
    authMiddleware.authenticateRequest,
    studentController.getClassmatesForStudentInSection
);
router.get(
    "/:student_id(\\d+)/social-medias",
    authMiddleware.authenticateRequest,
    studentController.getSocialMediasForStudent
);

module.exports = router;
