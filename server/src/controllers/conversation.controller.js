const db = require("../configs/db.config");
const queries = require("../utils/queries");

/**
 * Creates a conversation
 *
 * @param {number} req.body.student_id_1 - the ID of the first student in the conversation
 * @param {number} req.body.student_id_2 - the ID of the second student in the conversation
 *
 * @returns
 * - 201 Created if successful
 * - 400 Bad Request if students do not exist
 * - 500 Internal Server Error if unexpected error
 */
const createConversation = async (req, res, next) => {
    const payload = req.body;

    // Check if students exist
    if (!(await studentExists(payload.student_id_1))) {
        return res.status(400).json({ message: `student with id '${payload.student_id_1}' does not exist` });
    } else if (!(await studentExists(payload.student_id_2))) {
        return res.status(400).json({ message: `student with id '${payload.student_id_2}' does not exist` });
    }

    // Create conversation
    try {
        const conversation = await db.one(queries.conversations.createConversation, [
            payload.student_id_1,
            payload.student_id_2,
        ]);

        return res.status(201).json(conversation);
    } catch (err) {
        return next(err); // unexpected error
    }
};

/**
 * Gets a conversation
 *
 * @param {number} req.params.student_id_1 - the ID of one of the students in the conversation
 * @param {number} req.params.student_id_2 - the ID of the other student in the conversation
 *
 * @returns
 * - 200 OK if successful
 * - 400 Bad Request if conversation does not exist
 * - 500 Internal Server Error if unexpected error
 */
const getConversation = async (req, res, next) => {
    const studentId1 = req.params.student_id_1;
    const studentId2 = req.params.student_id_2;

    // Check if conversation exists
    try {
        await db.one(queries.conversations.getConversationByStudentIds, [studentId1, studentId2]);
    } catch (err) {
        return res.status(400).send({
            message: `conversation between students with ids '${studentId1}' and '${studentId2}' does not exist`,
        });
    }

    // Get conversation
    try {
        const conversation = await db.one(queries.conversations.getConversationByStudentIds, [studentId1, studentId2]);
        return res.status(200).json(conversation);
    } catch (err) {
        return next(err); // unexpected error
    }
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
    createConversation,
    getConversation,
    getMessagesForConversation,
};
