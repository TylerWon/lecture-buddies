const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

router.post("/login", authController.login, authController.afterLogin);
router.post("/logout", authController.logout);
router.post("/signup", authController.signup);

module.exports = router;
