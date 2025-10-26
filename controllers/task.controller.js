const taskModel = require("../model/task.model");

exports.allTask = async (req, res) => {
  try {
    let tasks;
    if (req.user.role === "admin") {
      tasks = await taskModel.find().populate("user_id", "name email").exec();
    } else {
      tasks = await taskModel.find({ user_id: req.user._id }).exec();
    }
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.addTask = async (req, res) => {
  try {
    const task = await taskModel.create({
      title: req.body.title,
      description: req.body.description,
      user_id: req.user._id,
    });
    res.status(201).json({ message: "One task added successfully", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await taskModel.findById(req.params.id);
    task.title = req.body.title;
    task.description = req.body.description;
    await task.save();

    res.status(200).json({ message: "Taks updated successfully" });
  } catch (error) {
    console.error("Error updating task", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await taskModel.findById(req.params.id);
    await task.deleteOne();
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

console.log("Task controller is working");
