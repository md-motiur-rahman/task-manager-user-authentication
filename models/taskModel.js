const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    unique: [true, "Title must be unique"],
    trim: true,
    maxlength: [100, "The length must be at most 100 characters"],
    minlength: [5, "The length must be at least 3 characters"],
  },
  description: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  status: {
    type: Boolean,
    default: false,
    required: [true, "A task must have a status"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "A task must have a user"],
  },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
