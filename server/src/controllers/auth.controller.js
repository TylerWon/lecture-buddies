const passport = require("passport");
const LocalStrategy = require("passport-local");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const db = require("../configs/db.config");
const queries = require("../utils/queries");

/**
 * Passport strategy for authentication with username and password. Verifies that the provided username and password
 * are correct
 *
 * If authentication successful, creates a session for the user and calls the next middleware function in the stack
 * If authentication unsuccessful, returns a 401 Unauthorized response
 */
passport.use(
    new LocalStrategy(async (username, password, cb) => {
        let hashedPassword;
        let user;

        // Check if user exists
        try {
            user = await db.one(queries.users.getUserByUsername, [username]);
        } catch (err) {
            return cb(null, false); // authentication failure - username incorrect
        }

        // Check if password correct
        try {
            hashedPassword = crypto.pbkdf2Sync(password, user.salt, 1024, 32, "sha256");
        } catch (err) {
            return cb(err); // error when computing hashed password
        }

        if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return cb(null, false); // authentication failure - password incorrect
        }

        return cb(null, user); // authentication success
    })
);

// Passport serializer - serializes user data in req.user into session store
passport.serializeUser((user, cb) => {
    process.nextTick(() => {
        return cb(null, { user_id: user.user_id, username: user.username });
    });
});

// Passport deserializer - deserializes user data from session store into req.user
passport.deserializeUser((user, cb) => {
    process.nextTick(() => {
        return cb(null, user);
    });
});

/**
 * Logs a user in using the user's session
 *
 * @returns
 * - 200 OK if login successful
 * - 401 Unauthorized if login unsuccessful
 * - 500 Internal Server Error if unexpected error
 */
const autoLogin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "unauthenticated" });
    }

    return res.status(200).json({ user_id: req.user.user_id });
};

/**
 * Logs a user in using the local Passport strategy
 *
 * @param {string} req.body.username - The user's email
 * @param {string} req.body.password - The user's password
 *
 * @returns
 * - 200 OK if login successful
 * - 401 Unauthorized if login unsuccessful
 * - 500 Internal Server Error if unexpected error
 * - Otherwise, calls the next middleware function in the stack
 */
const login = passport.authenticate("local");

/**
 * Runs after a successful login. Sends the user id of the user who just logged in
 *
 * @returns 200 OK
 */
const afterLogin = (req, res, next) => {
    const user = req.user;

    return res.status(200).json({
        user_id: user.user_id,
    });
};

/**
 * Logs a user out by destroying the user's session
 *
 * @returns
 * - 200 OK if logout successful
 * - 500 Internal Server Error if unexpected error
 */
const logout = (req, res, next) => {
    // Remove session for the user
    req.logout((err) => {
        if (err) {
            return next(err); // unexpected error
        }

        return res.status(200).json({ message: "logout successful" });
    });
};

/**
 * Registers a user by creating a user and a session for the user
 *
 * @param {string} req.body.username - The user's email
 * @param {string} req.body.password - The user's password
 *
 * @returns
 * - 200 OK if sign up successful
 * - 400 Bad Request if missing or invalid body fields or an account with the username already exists
 * - 500 Internal Server Error if unexpected error
 */
const signup = async (req, res, next) => {
    let hashedPassword, user;
    const username = req.body.username;
    const password = req.body.password;
    const salt = crypto.randomBytes(16);

    // Create hashed password
    try {
        hashedPassword = crypto.pbkdf2Sync(password, salt, 1024, 32, "sha256");
    } catch (err) {
        return next(err); // unexpected error
    }

    // Create user
    try {
        user = await db.one(queries.users.createUser, [username, hashedPassword, salt]);
    } catch (err) {
        return res.status(400).json({ message: "an account with that username already exists" });
    }

    // Create session for the user
    req.login(user, (err) => {
        if (err) {
            return next(err); // unexpected error
        }

        return res.status(200).json({ user_id: user.user_id });
    });
};

module.exports = {
    autoLogin,
    login,
    afterLogin,
    logout,
    signup,
};
