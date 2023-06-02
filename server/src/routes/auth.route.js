const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

// Provide additional function because authController.login needs to call the next function in the stack when authentication is successful (otherwise it hangs due to passport.authenticate())
router.post("/login", authController.login, (req, res, next) => res.send("Login successful"));
router.post("/logout", authController.logout);
router.post("/signup", authController.signup);

module.exports = router;
