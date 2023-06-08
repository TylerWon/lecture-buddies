const express = require("express");
const router = express.Router();

const schoolController = require("../controllers/school.controller");
const authUtils = require("../utils/auth");

router.get("/", authUtils.authenticateRequest, schoolController.getSchools);
router.get("/:school_id(\\d+)/subjects", authUtils.authenticateRequest, schoolController.getSubjectsForSchool);

module.exports = router;
