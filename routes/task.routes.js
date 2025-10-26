const express = require("express");
const {
  allTask,
  addTask,
  updateTask,
  deleteTask,
} = require("../controllers/task.controller");
const taskRouter = express.Router();
const checkAuth = require("../middleware/auth");

taskRouter.get("/all", checkAuth, allTask);
taskRouter.post("/add", checkAuth, addTask);
taskRouter.patch("/update/:id", checkAuth, updateTask);
taskRouter.delete("/delete/:id", checkAuth, deleteTask);

module.exports = taskRouter;
console.log("Task router is working");
