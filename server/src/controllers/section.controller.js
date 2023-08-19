const db = require("../configs/db.config");
const queries = require("../utils/queries");

/**
 * Gets the details for a section. This includes information about the subject, course, and section.
 *
 * @param {number} req.params.section_id - The section's ID
 *
 * @returns
 * - 200 OK if successful
 * - 400 Bad Request if section does not exist
 * - 500 Internal Server Error if unexpected error
 */
const getSectionDetails = async (req, res, next) => {
    const sectionId = req.params.section_id;

    // Check if section exists
    try {
        await db.one(queries.sections.getSection, [sectionId]);
    } catch (err) {
        return res.status(400).json({ message: `section with id ${sectionId} does not exist` });
    }

    // Get section details
    try {
        const sectionDetails = await db.one(queries.sections.getSectionDetails, [sectionId]);
        return res.status(200).json(sectionDetails);
    } catch (err) {
        return next(err); // unexpected error
    }
};

module.exports = {
    getSectionDetails,
};
