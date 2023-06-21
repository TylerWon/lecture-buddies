const express = require("express");
const router = express.Router();

const socialMediaController = require("../controllers/socialMedia.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validationMiddleware = require("../middlewares/validation.middleware");
const validationSchemas = require("../utils/validationSchemas");

router.post(
    "/",
    // validationSchemas.createSocialMediaValidationSchema(),
    // validationMiddleware.validateRequest,
    authMiddleware.authenticateRequest,
    socialMediaController.createSocialMedia
);

module.exports = router;
