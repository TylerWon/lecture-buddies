require("dotenv").config();

const db = require("./configs/db.config");
const express = require("express");
const logger = require("morgan");
const passport = require("passport");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);

const authRouter = require("./routes/auth.route");
const schoolRouter = require("./routes/school.route");
const subjectRouter = require("./routes/subject.route");
const courseRouter = require("./routes/course.route");

const app = express();

// Middleware
// logs requests
app.use(logger("dev"));

// parses request bodies (required for any request type that provides a body (i.e. POST, PUT))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// allows sessions
app.use(
    session({
        store: new pgSession({
            pgPromise: db,
            createTableIfMissing: true,
        }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.session());

// Routes
app.use("/auth", authRouter);
app.use("/schools", schoolRouter);
app.use("/subjects", subjectRouter);
app.use("/courses", courseRouter);
app.get("/", (req, res) => res.send("Hello World!"));

module.exports = app;