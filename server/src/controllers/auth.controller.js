const passport = require("passport");
const LocalStrategy = require("passport-local");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const db = require("../configs/db.config");
const queries = require("../utils/queries");

// Passport strategy for authentication with username and password
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

// Passport user serializer and deserializer for sessions
passport.serializeUser((user, cb) => {
    process.nextTick(() => {
        return cb(null, { token: user.token });
    });
});

passport.deserializeUser((user, cb) => {
    process.nextTick(() => {
        return cb(null, user);
    });
});

/**
 * Logs a user in
 *
 * @returns
 * - 401 Unauthorized if login unsuccessful
 * - 500 Internal Server Error if unexpected error
 * - Otherwise, calls the next middleware function in the stack
 */
const login = passport.authenticate("local");

/**
 * Runs after a successful login. Sends information about the user who just logged in
 *
 * @returns 200 OK
 */
const afterLogin = (req, res, next) => {
    return res.json({
        token: req.user.token,
    });
};

/**
 * Logs a user out
 *
 * @returns
 * - 200 OK if logout successful
 * - 500 Internal Server Error if unexpected error
 */
const logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        return res.json({ message: "logout successful" });
    });
};

/**
 * Registers a user
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
    let token, hashedPassword, user;
    const username = req.body.username;
    const password = req.body.password;
    const salt = crypto.randomBytes(16);

    // Create user with just username
    try {
        user = await db.one(queries.users.createUser, [username, null, null, null]);
    } catch (err) {
        return res.status(400).json({ message: "an account with that username already exists" });
    }

    // Create hashed password and token
    try {
        hashedPassword = crypto.pbkdf2Sync(password, salt, 1024, 32, "sha256");
        token = jwt.sign({ user_id: user.user_id, username: user.username }, process.env.JWT_SECRET);
    } catch (err) {
        return next(err); // error when computing hashed password or token
    }

    // Update user with hashed password, salt, and token
    try {
        user = await db.one(queries.users.updateUser, [user.username, hashedPassword, salt, token, user.user_id]);
    } catch (err) {
        return next(err); // error when updating user
    }

    // Login user
    req.login(user, (err) => {
        if (err) {
            return next(err);
        }

        return res.json({ token: user.token });
    });
};

module.exports = {
    login,
    afterLogin,
    logout,
    signup,
};
