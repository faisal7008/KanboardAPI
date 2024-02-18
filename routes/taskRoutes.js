const express = require('express');
const router = express.Router({mergeParams: true}); // to access params from the parent router
const { getBoardTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Route to get tasks for a specific board
// Method: GET
// URL: /api/boards/:boardId/tasks/
// Middleware: verifyToken (to verify authentication)
router.get('/', verifyToken, getBoardTasks);

// Route to create a new task for a specific board
// Method: POST
// URL: /api/boards/:boardId/tasks/
// Middleware: verifyToken (to verify authentication)
router.post('/', verifyToken, createTask);

// Route to update an existing task
// Method: PUT
// URL: /api/boards/:boardId/tasks/:taskId
// Middleware: verifyToken (to verify authentication)
router.put('/:taskId', verifyToken, updateTask);

// Route to delete an existing task
// Method: DELETE
// URL: /api/boards/:boardId/tasks/:taskId
// Middleware: verifyToken (to verify authentication)
router.delete('/:taskId', verifyToken, deleteTask);

module.exports = router;
