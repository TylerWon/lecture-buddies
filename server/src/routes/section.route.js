const express = require("express");
const router = express.Router();

const sectionController = require("../controllers/section.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/:section_id(\\d+)/details", authMiddleware.authenticateRequest, sectionController.getSectionDetails);

module.exports = router;
