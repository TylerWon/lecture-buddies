const pgp = require("pg-promise")();

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
    if (!(await studentExists(payload.student_id))) {
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
    const socialMediaId = req.params.social_media_id;

    // Check if social media exists
    if (!(await socialMediaExists(socialMediaId))) {
        return res.status(400).json({ message: `social media with id '${socialMediaId}' does not exist` });
    }

    // Delete social media
    try {
        await db.none(queries.socialMedias.deleteSocialMedia, [socialMediaId]);
        return res.status(200).json({ message: "social media deleted" });
    } catch (err) {
        return next(err); // unexpected error
    }
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
    const socialMediaId = req.params.social_media_id;
    const payload = req.body;

    // Check if social media exists
    if (!(await socialMediaExists(socialMediaId))) {
        return res.status(400).json({ message: `social media with id '${socialMediaId}' does not exist` });
    }

    // Check if student exists
    if (payload.student_id && !(await studentExists(payload.student_id))) {
        return res.status(400).json({ message: `student with id '${payload.student_id}' does not exist` });
    }

    // Update social media
    try {
        // Dynamically construct query based on fields in payload
        const condition = pgp.as.format("WHERE social_media_id = $1", socialMediaId);
        const query = `${pgp.helpers.update(payload, null, "social_medias")} ${condition} RETURNING *`;

        const socialMedia = await db.one(query);
        return res.status(200).json(socialMedia);
    } catch (err) {
        return next(err); // unexpected error
    }
};

/**
 * Checks if a social media exists
 *
 * @param {number} socialMediaId - the social media's ID
 *
 * @returns
 * - true if the social media exists
 * - false if the social media does not exist
 */
const socialMediaExists = async (socialMediaId) => {
    try {
        await db.one(queries.socialMedias.getSocialMedia, [socialMediaId]);
        return true;
    } catch (err) {
        return false;
    }
};

/**
 * Checks if a student exists
 *
 * @param {number} studentId - the student's ID
 *
 * @returns
 * - true if the student exists
 * - false if the student does not exist
 */
const studentExists = async (studentId) => {
    try {
        await db.one(queries.students.getStudent, [studentId]);
        return true;
    } catch (err) {
        return false;
    }
};

module.exports = {
    createSocialMedia,
    deleteSocialMedia,
    updateSocialMedia,
};
