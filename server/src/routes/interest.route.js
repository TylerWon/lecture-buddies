const express = require("express");
const router = express.Router();

const interestController = require("../controllers/interest.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validationMiddleware = require("../middlewares/validation.middleware");
const validationSchemas = require("../utils/validationSchemas");

router.post(
    "/",
    validationSchemas.createInterestValidationSchema(),
    validationMiddleware.validateRequest,
    authMiddleware.authenticateRequest,
    interestController.createInterest
);

module.exports = router;
