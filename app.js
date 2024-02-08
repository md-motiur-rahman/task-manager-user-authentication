const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const globalErrorHandler = require('./controllers/errorHandler');
const userRouter = require('./routes/userRoute');
const taskRouter = require('./routes/taskRoute');
const rateLimit = require('express-rate-limit');

const app = express();

app.use(bodyParser.json());
app.use(morgan("dev"));
//limit request from same api
const limiter = rateLimit({
    max: 100,
    windowMs: 1 * 60 * 60 * 100,
    message: 'Too many request from this IP. Please try again in an hour',
  });
  app.use('/api', limiter);
app.get("/", (req, res) => {
  res.status(200).send("ENtry Point");
});

//user routes
app.use('/api/v1/users', userRouter);
//task routes
app.use('/api/v1/tasks', taskRouter);

app.use(globalErrorHandler)

module.exports = app;
