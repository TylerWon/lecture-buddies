const express = require("express");
const router = express.Router();

const conversationController = require("../controllers/conversation.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validationMiddleware = require("../middlewares/validation.middleware");
const validationSchemas = require("../utils/validationSchemas");

router.post(
    "/",
    validationSchemas.createConversationValidationSchema(),
    validationMiddleware.validateRequest,
    authMiddleware.authenticateRequest,
    conversationController.createConversation
);
router.get(
    "/:conversation_id(\\d+)/messages",
    validationSchemas.sortingAndPaginationValidationSchema(
        [/^(-?)(date)$/],
        "order_by must be one of 'date' or '-date'"
    ),
    validationMiddleware.validateRequest,
    authMiddleware.authenticateRequest,
    conversationController.getMessagesForConversation
);

module.exports = router;
