const db = require("../configs/db.config");
const queries = require("../utils/queries");

/**
 * Creates a message
 *
 * @param {number} req.body.conversation_id - the ID of the conversation the message belongs to
 * @param {number} req.body.author_id - the ID of the student who sent the message
 * @param {string} req.body.message_content - the message's content
 *
 * @returns
 * - 201 Created if successful
 * - 400 Bad Request if conversation or student does not exist
 * - 500 Internal Server Error if unexpected error
 */
const createMessage = async (req, res, next) => {
    res.send("Not implemented");
};

module.exports = {
    createMessage,
};
