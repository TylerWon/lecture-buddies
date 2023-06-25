const db = require("../configs/db.config");
const queries = require("../utils/queries");

/**
 * Creates a conversation
 *
 * @param {number} req.body.conversation_name - the conversation's name
 * @param {number} req.body.conversation_members - the IDs of the students that are members of the conversation
 *
 * @returns
 * - 201 Created if successful
 * - 400 Bad Request if students do not exist
 * - 500 Internal Server Error if unexpected error
 */
const createConversation = async (req, res, next) => {
    res.send("Not implemented");
};

/**
 * Gets the messages for a conversation
 *
 * @param {number} req.params.conversation_id - the conversation's ID
 *
 * @returns
 * - 200 OK if successful
 * - 400 Bad Request if conversation does not exist
 * - 500 Internal Server Error if unexpected error
 */
const getMessagesForConversation = async (req, res, next) => {
    res.send("Not implemented");
};

module.exports = {
    createConversation,
    getMessagesForConversation,
};
