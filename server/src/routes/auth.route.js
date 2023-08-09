const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validationMiddleware = require("../middlewares/validation.middleware");
const validationSchemas = require("../utils/validationSchemas");

router.post("/autologin", authController.autoLogin);
router.post(
    "/login",
    validationSchemas.authValidationSchema(),
    validationMiddleware.validateRequest,
    authController.login,
    authController.afterLogin
);
router.post("/logout", authMiddleware.authenticateRequest, authController.logout);
router.post(
    "/signUp",
    validationSchemas.authValidationSchema(),
    validationMiddleware.validateRequest,
    authController.signUp
);

module.exports = router;
