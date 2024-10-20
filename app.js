const express = require("express");
const cors = require("cors");
require("dotenv").config();

const userRouter = require("./routes/api/users");
const planRouter = require("./routes/api/plans");

app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/plans", planRouter);

module.exports = app;
