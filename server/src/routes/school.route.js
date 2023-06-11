const express = require("express");
const router = express.Router();

const schoolController = require("../controllers/school.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", authMiddleware.authenticateRequest, schoolController.getSchools);
router.get("/:school_id(\\d+)/subjects", authMiddleware.authenticateRequest, schoolController.getSubjectsForSchool);

module.exports = router;
