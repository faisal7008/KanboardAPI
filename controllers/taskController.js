const Task = require("../models/Task");

// To create a new task for a specific board
const createTask = async (req, res) => {
  try {
    // Extract task data from the request body
    const { title, description, category, assignedTo, deadline } = req.body;
    const { boardId } = req.params;

    // Check if required fields are missing
    if (
      !boardId ||
      !title ||
      !description ||
      !category ||
      !assignedTo ||
      !deadline
    ) {
      return res.status(400).json({ boardId, error: "Missing required fields" });
    }

    // Create a new task instance
    const task = new Task({
      board: boardId,
      title,
      description,
      category,
      assignedTo,
      deadline,
    });

    // Save the task to the database
    await task.save();

    res.status(201).json(task);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create task", details: error.message });
  }
};

// To retrieve tasks for a specific board
const getBoardTasks = async (req, res) => {
  try {
    const { boardId } = req.params;

    // Find tasks belonging to the specified board
    const tasks = await Task.find({ board: boardId });

    res.status(200).json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch tasks", details: error.message });
  }
};

// To retrieve a specific task 
const getOneTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Find tasks belonging to the specified board
    const task = await Task.findById(taskId);

    res.status(200).json(task);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch a task", details: error.message });
  }
};

// To update an existing task
const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Update task details based on the request body
    await Task.findByIdAndUpdate(taskId, req.body, { new: true });

    // Find and return the updated task
    const updatedTask = await Task.findById(taskId);

    res.status(200).json(updatedTask);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update task", details: error.message });
  }
};

// To delete an existing task
const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Delete the task from the database
    await Task.findByIdAndDelete(taskId);

    res.status(200).json({ taskId, message: "Task deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete task", details: error.message });
  }
};

module.exports = { createTask, getBoardTasks, getOneTask, updateTask, deleteTask };
