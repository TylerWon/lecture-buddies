const { validationResult } = require("express-validator");

/**
 * Validates a request by checking if any errors were found by express-validator
 *
 * @returns
 * - 400 Bad Request if errors were found
 * - Otherwise, calls the next middleware function in the stack
 */
const validateRequest = (req, res, next) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        return res.status(400).json(result.array({ onlyFirstError: true }));
    }

    next();
};

module.exports = {
    validateRequest,
};
