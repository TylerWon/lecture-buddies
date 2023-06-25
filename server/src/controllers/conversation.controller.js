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
    const payload = req.body;

    // Check if students exist
    for (const studentId of payload.conversation_members) {
        try {
            await db.one(queries.students.getStudent, [studentId]);
        } catch (err) {
            return res.status(400).send({ message: `student with id '${studentId}' does not exist` });
        }
    }

    // Create conversation
    let conversation;
    try {
        conversation = await db.one(queries.conversations.createConversation, [payload.conversation_name]);
    } catch (err) {
        return next(err); // unexpected error
    }

    // Add students to conversation
    conversation.conversation_members = [];
    for (const studentId of payload.conversation_members) {
        try {
            const conversationMember = await db.one(queries.conversationMembers.createConversationMember, [
                conversation.conversation_id,
                studentId,
            ]);
            conversation.conversation_members.push(conversationMember.student_id);
        } catch (err) {
            return next(err); // unexpected error
        }
    }

    return res.status(201).json(conversation);
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
