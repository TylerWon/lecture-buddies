require("dotenv").config();

// Express
const express = require("express");
const app = express();
const port = 8000;

// Middleware
const morgan = require("morgan");
app.use(morgan("dev"));

// Routes
const authRouter = require("./routes/auth");

app.use("/auth", authRouter);

// Start server
app.listen(port, () => console.log(`app listening on port ${port}`));
