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
 * @param {string} req.query.order_by - the field to order the response by (options: date, -date)
 * @param {string} req.query.offset - the position to start returning results from
 * @param {string} req.query.limit - the number of results to return
 *
 * @returns
 * - 200 OK if successful
 * - 400 Bad Request if conversation does not exist
 * - 500 Internal Server Error if unexpected error
 */
const getMessagesForConversation = async (req, res, next) => {
    const conversation_id = req.params.conversation_id;
    const orderBy = req.query.order_by;
    const offset = req.query.offset;
    const limit = req.query.limit;

    // Check if conversation exists
    try {
        await db.one(queries.conversations.getConversation, [conversation_id]);
    } catch (err) {
        return res.status(400).send({ message: `conversation with id '${conversation_id}' does not exist` });
    }

    try {
        // Get messages for conversation
        let messages = await db.any(queries.conversations.getMessagesForConversation, [conversation_id]);

        // Sort messages
        switch (orderBy) {
            case "date":
                messages.sort((a, b) => a.sent_datetime - b.sent_datetime);
                break;
            case "-date":
                messages.sort((a, b) => b.sent_datetime - a.sent_datetime);
                break;
        }

        // Paginate messages
        messages = messages.slice(offset, offset + limit);

        return res.status(200).json(messages);
    } catch (err) {
        return next(err); // unexpected error
    }
};

module.exports = {
    createConversation,
    getMessagesForConversation,
};
