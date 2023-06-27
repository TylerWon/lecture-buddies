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
 * - 400 Bad Request if student does not exist
 * - 500 Internal Server Error if unexpected error
 */
const createSocialMedia = async (req, res, next) => {
    const payload = req.body;

    // Check if student exists
    try {
        await db.one(queries.students.getStudent, [payload.student_id]);
    } catch (err) {
        return res.status(400).json({ message: `student with id '${payload.student_id}' does not exist` });
    }

    // Create social media
    try {
        const socialMedia = await db.one(queries.socialMedias.createSocialMedia, [
            payload.student_id,
            payload.social_media_platform,
            payload.social_media_url,
        ]);
        return res.status(201).json(socialMedia);
    } catch (err) {
        return next(err); // unexpected error
    }
};

/**
 * Deletes a social media
 *
 * @param {number} req.params.social_media_id - the social media's ID
 *
 * @returns
 * - 200 OK if successful
 * - 400 Bad Request if social media does not exist
 * - 500 Internal Server Error if unexpected error
 */
const deleteSocialMedia = async (req, res, next) => {
    res.send("Not implemented");
};

/**
 * Updates a social media
 *
 * @param {number} req.params.social_media_id - the social media's ID
 * @param {number} req.body.student_id - the new ID of the student that the social media belongs to
 * @param {string} req.body.social_media_platform - the new social media platform
 * @param {string} req.body.social_media_url - the new URL of the student's profile on the platform
 *
 * @returns
 * - 200 OK if successful
 * - 400 Bad Request if social media or student does not exist
 * - 500 Internal Server Error if unexpected error
 */
const updateSocialMedia = async (req, res, next) => {
    res.send("Not implemented");
};

module.exports = {
    createSocialMedia,
    deleteSocialMedia,
    updateSocialMedia,
};
