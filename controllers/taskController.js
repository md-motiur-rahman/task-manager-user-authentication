const Task = require("../models/taskModel");
const catchAsync = require("../utils/catchAsync");
const CustomError = require("../utils/customError");

//set the user id while creating a task
exports.taskUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.addTask = catchAsync(async (req, res, next) => {
  const task = await Task.create(req.body);

  if (!task) {
    return next(new CustomError("Task not created", 424));
  }

  res.status(200).json({
    status: "success",
    data: {
      task,
    },
  });
});

exports.getAllTask = catchAsync(async (req, res, next) => {
  const tasks = await Task.find({ user: req.user.id });
  res.status(200).json({
    status: "Success",
    result: tasks.length,
    data: {
      tasks,
    },
  });
});

exports.getATask = catchAsync(async (req, res, next) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
  if (!task) {
    return next(new CustomError("Task Not Found", 404));
  }
  res.status(200).json({
    status: "success",
    task: {
      task,
    },
  });
});

exports.updateTask = catchAsync(async (req, res, next) => {
  const updatedTask = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    {
      new: true,
      runValidator: true,
    }
  );
  if (!updatedTask) {
    return next(new CustomError("Task Not Found", 404));
  }
  res.status(200).json({
    status: "success",
    data: updatedTask,
  });
});

exports.deleteTask = catchAsync(async (req, res, next) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });
  if (!task) {
    return next(new CustomError("Task Not Found", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
