const express = require("express");
const { checkSchema } = require("express-validator");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validationMiddleware = require("../middlewares/validation.middleware");

// express-validator schema for validating request
const authValidationSchema = () =>
    checkSchema({
        username: {
            in: ["body"],
            exists: {
                errorMessage: "username is required",
            },
            isString: {
                errorMessage: "username must be a string",
            },
        },
        password: {
            in: ["body"],
            exists: {
                errorMessage: "password is required",
            },
            isString: {
                errorMessage: "password must be a string",
            },
        },
    });

router.post(
    "/login",
    authValidationSchema(),
    validationMiddleware.validateRequest,
    authController.login,
    authController.afterLogin
);
router.post("/logout", authMiddleware.authenticateRequest, authController.logout);
router.post("/signup", authValidationSchema(), validationMiddleware.validateRequest, authController.signup);

module.exports = router;
