const mongoose = require("../db/db");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
    },

    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
      required: true,
    },
  },

  {
    timestamps: true,
    versionKey: false,
  }
);

const Task = mongoose.model("taskDB", taskSchema, "tasks");

module.exports = Task;
console.log("Task model is working");
