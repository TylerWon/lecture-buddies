const express = require("express");
const router = express.Router();

const socialMediaController = require("../controllers/socialMedia.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validationMiddleware = require("../middlewares/validation.middleware");
const validationSchemas = require("../utils/validationSchemas");

router.post(
    "/",
    validationSchemas.createSocialMediaValidationSchema(),
    validationMiddleware.validateRequest,
    authMiddleware.authenticateRequest,
    socialMediaController.createSocialMedia
);
router.delete("/:social_media_id(\\d+)", authMiddleware.authenticateRequest, socialMediaController.deleteSocialMedia);
router.put(
    "/:social_media_id(\\d+)",
    // validationSchemas.createUpdateSocialMediaValidationSchema(),
    validationMiddleware.validateRequest,
    authMiddleware.authenticateRequest,
    socialMediaController.updateSocialMedia
);

module.exports = router;
