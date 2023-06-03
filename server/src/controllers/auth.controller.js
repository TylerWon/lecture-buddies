const db = require("../configs/db.config");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const queries = require("../utils/queries");

// Passport strategy for authentication with username and password
passport.use(
    new LocalStrategy(async (username, password, cb) => {
        let hashedPassword;

        const user = await db.oneOrNone(queries.users.getUser, [username]);
        if (!user) {
            return cb(null, false); // authentication failure - username incorrect
        }

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
        return cb(null, { user_id: user.user_id, token: user.token });
    });
});

passport.deserializeUser((user, cb) => {
    process.nextTick(() => {
        return cb(null, user);
    });
});

// Controllers
const login = passport.authenticate("local", { successRedirect: "/" }); // TODO: redirect to /courses

const logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        res.send("Logout successful");
    });
};

const signup = async (req, res, next) => {
    let token, hashedPassword, user;
    const username = req.body.username;
    const password = req.body.password;
    const salt = crypto.randomBytes(16);

    try {
        hashedPassword = crypto.pbkdf2Sync(password, salt, 1024, 32, "sha256");
        token = jwt.sign({ username: username }, process.env.JWT_SECRET);
    } catch (err) {
        next(err); // error when computing hashed password or token
    }

    try {
        user = await db.one(queries.users.createUser, [username, hashedPassword, salt, token]);
    } catch (err) {
        res.status(400).send("Username already exists");
    }

    req.login(user, (err) => {
        if (err) {
            return next(err);
        }

        res.send("Sign up successful");
    });
};

module.exports = {
    login,
    logout,
    signup,
};
