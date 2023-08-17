const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.delete("/:user_id(\\d+)", authMiddleware.authenticateRequest, userController.deleteUser);

module.exports = router;
