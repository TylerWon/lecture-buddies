require("dotenv").config();

const db = require("./configs/db.config");
const express = require("express");
const logger = require("morgan");
const passport = require("passport");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);

const authRouter = require("./routes/auth.route");
const conversationRouter = require("./routes/conversation.route");
const courseRouter = require("./routes/course.route");
const enrolmentRouter = require("./routes/enrolment.route");
const friendshipRouter = require("./routes/friendship.route");
const interestRouter = require("./routes/interest.route");
const messageRouter = require("./routes/message.route");
const schoolRouter = require("./routes/school.route");
const socialMediaRouter = require("./routes/socialMedia.route");
const subjectRouter = require("./routes/subject.route");
const studentRouter = require("./routes/student.route");

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
app.use("/conversations", conversationRouter);
app.use("/courses", courseRouter);
app.use("/enrolments", enrolmentRouter);
app.use("/friendships", friendshipRouter);
app.use("/interests", interestRouter);
app.use("/messages", messageRouter);
app.use("/schools", schoolRouter);
app.use("/social-medias", socialMediaRouter);
app.use("/subjects", subjectRouter);
app.use("/students", studentRouter);

module.exports = app;
