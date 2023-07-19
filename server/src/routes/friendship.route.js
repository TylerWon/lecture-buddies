const express = require("express");
const router = express.Router();

const friendshipController = require("../controllers/friendship.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validationMiddleware = require("../middlewares/validation.middleware");
const validationSchemas = require("../utils/validationSchemas");

router.post(
    "/",
    validationSchemas.createFriendshipValidationSchema(),
    validationMiddleware.validateRequest,
    authMiddleware.authenticateRequest,
    friendshipController.createFriendship
);
router.patch(
    "/:requestor_id(\\d+)/:requestee_id(\\d+)",
    validationSchemas.updateFriendshipValidationSchema(),
    validationMiddleware.validateRequest,
    authMiddleware.authenticateRequest,
    friendshipController.updateFriendship
);

module.exports = router;
