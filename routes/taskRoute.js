const express = require("express");

const taskController = require("../controllers/taskController");
const userController = require("../controllers/userController");

const taskRouter = express.Router();

taskRouter
  .route("/")
  .post(
    userController.protect,
    taskController.taskUserId,
    taskController.addTask
  )
  .get(userController.protect, taskController.getAllTask);

taskRouter
  .route("/:id")
  .get(userController.protect, taskController.getATask)
  .patch(userController.protect, taskController.updateTask)
  .delete(userController.protect, taskController.deleteTask);

module.exports = taskRouter;
