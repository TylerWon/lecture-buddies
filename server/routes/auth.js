const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.post("/login", authController.login, (req, res) => res.send("Login successful")); // Provide additional function because authController.login calls the next function in the stack when authentication is successful
router.post("/logout", authController.logout);
router.post("/signup", authController.signup);

module.exports = router;
