const express = require("express");
const router = express.Router();

const enrolmentController = require("../controllers/enrolment.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validationMiddleware = require("../middlewares/validation.middleware");
const validationSchemas = require("../utils/validationSchemas");

router.post(
    "/",
    validationSchemas.createEnrolmentValidationSchema(),
    validationMiddleware.validateRequest,
    authMiddleware.authenticateRequest,
    enrolmentController.createEnrolment
);

module.exports = router;
