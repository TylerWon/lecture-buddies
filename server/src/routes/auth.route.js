const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const authUtils = require("../utils/auth");

router.post("/login", authController.login, authController.afterLogin);
router.post("/logout", authUtils.authenticateRequest, authController.logout);
router.post("/signup", authController.signup);

module.exports = router;
