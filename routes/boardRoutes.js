const express = require('express');
const router = express.Router();
const { getHomeBoards, getAllBoards, createBoard, editBoard, getOneBoard, inviteUserToBoard } = require('../controllers/boardController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Route to get the user's last 3 visited Kanban Boards for the home page
// Method: GET
// URL: /api/boards/home
// Middleware: verifyToken (to verify authentication)
router.get('/home', verifyToken, getHomeBoards);

// Route to get all Kanban Boards that the user belongs to (including their own if they have created it) for the boards page
// Method: GET
// URL: /api/boards
// Middleware: verifyToken (to verify authentication)
router.get('/', verifyToken, getAllBoards);

// Route to create a new Kanban Board
// Method: POST
// URL: /api/boards
// Middleware: verifyToken (to verify authentication)
router.post('/', verifyToken, createBoard);

// Route to get a Kanban Board by ID
// Method: GET
// URL: /api/boards/:boardId
// Middleware: verifyToken (to verify authentication)
router.get('/:boardId', verifyToken, getOneBoard);

// Route to edit a Kanban Board
// Method: PUT
// URL: /api/boards/:boardId
// Middleware: verifyToken (to verify authentication)
router.put('/:boardId', verifyToken, editBoard);

// Route to invite a user to the board
// Method: POST
// URL: /api/boards/:boardId/invite
// Middleware: verifyToken (to verify authentication)
router.post('/:boardId/invite', verifyToken, inviteUserToBoard);

module.exports = router;
