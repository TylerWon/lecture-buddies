const db = require("../configs/db.config");
const queries = require("../utils/queries");

/**
 * Creates a social media
 *
 * @param {number} req.body.student_id - the ID of the student that the social media belongs to
 * @param {string} req.body.social_media_platform - the social media platform
 * @param {string} req.body.social_media_url - the URL of the student's profile on the platform
 *
 * @returns
 * - 201 Created if successful
 * - 500 Internal Server Error if unexpected error
 */
const createSocialMedia = async (req, res, next) => {
    res.send("Not implemented");
};

module.exports = {
    createSocialMedia,
};
