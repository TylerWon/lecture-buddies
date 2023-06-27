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
router.delete("/:interest_id(\\d+)", authMiddleware.authenticateRequest, interestController.deleteInterest);
router.put(
    "/:interest_id(\\d+)",
    // validationSchemas.updateInterestValidationSchema(),
    validationMiddleware.validateRequest,
    authMiddleware.authenticateRequest,
    interestController.updateInterest
);

module.exports = router;
