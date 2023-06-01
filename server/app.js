require("dotenv").config();
const db = require("./db");

// Express
const express = require("express");
const app = express();
const port = 8000;

// Middleware
// logs requests
const logger = require("morgan");
app.use(logger("dev"));

// parses request bodies (required for any request type that provides a body (i.e. POST, PUT))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// allows sessions
const passport = require("passport");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
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
const authRouter = require("./routes/auth");

app.use("/auth", authRouter);

// Start server
app.listen(port, () => console.log(`app listening on port ${port}`));
