require("dotenv").config();

const db = require("./src/configs/db.config");
const express = require("express");
const logger = require("morgan");
const passport = require("passport");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);

const authRouter = require("./src/routes/auth.route");
const schoolRouter = require("./src/routes/school.route");

// Express
const app = express();
const port = 8000;

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
app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`app listening on port ${port}`));
