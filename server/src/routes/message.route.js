const express = require("express");
const router = express.Router();

const messageController = require("../controllers/message.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validationMiddleware = require("../middlewares/validation.middleware");
const validationSchemas = require("../utils/validationSchemas");

router.post(
    "/",
    // validationSchemas.createMessageValidationSchema(),
    // validationMiddleware.validateRequest,
    authMiddleware.authenticateRequest,
    messageController.createMessage
);

module.exports = router;
