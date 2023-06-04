const express = require("express");
const router = express.Router();

const schoolController = require("../controllers/school.controller");

router.get("/", schoolController.getSchools);
router.get("/:school_id(\\d+)/subjects", schoolController.getSubjectsForSchool);

module.exports = router;
