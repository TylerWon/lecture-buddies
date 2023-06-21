const express = require("express");
const router = express.Router();

const enrolmentController = require("../controllers/enrolment.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", authMiddleware.authenticateRequest, enrolmentController.createEnrolment);

module.exports = router;
