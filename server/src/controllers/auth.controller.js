const db = require("../configs/db.config");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const crypto = require("crypto");

// Passport strategy for authentication with username and password
passport.use(
    new LocalStrategy(async (username, password, cb) => {
        try {
            const user = await db.oneOrNone("SELECT * FROM users WHERE username = $1", username);

            if (!user) {
                return cb(null, false); // authentication failure - username incorrect
            }

            const hashedPassword = crypto.pbkdf2Sync(password, user.salt, 1024, 32, "sha256");
            if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
                return cb(null, false); // authentication failure - password incorrect
            }

            return cb(null, user); // authentication success
        } catch (err) {
            return cb(err); // > 1 user retrieved from db or error when computing hashedPassword with pbkdf2
        }
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

const signup = (req, res, next) => {
    res.send("Not implemented");
};

module.exports = {
    login,
    logout,
    signup,
};
