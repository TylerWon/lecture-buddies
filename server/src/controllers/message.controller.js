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
    const payload = req.body;

    // Check if conversation exists
    try {
        await db.one(queries.conversations.getConversation, [payload.conversation_id]);
    } catch (err) {
        return res.status(400).json({ message: `conversation with id '${payload.conversation_id}' does not exist` });
    }

    // Check if student exists
    try {
        await db.one(queries.students.getStudent, [payload.author_id]);
    } catch (err) {
        return res.status(400).json({ message: `student with id '${payload.author_id}' does not exist` });
    }

    // Create message
    try {
        const message = await db.one(queries.messages.createMessage, [
            payload.conversation_id,
            payload.author_id,
            payload.message_content,
        ]);
        return res.status(201).json(message);
    } catch (err) {
        return next(err); // unexpected error
    }
};

module.exports = {
    createMessage,
};
