const Board = require("../models/Board");
const User = require("../models/User");

// Function to get the user's last 3 visited Kanban Boards
const getHomeBoards = async (req, res) => {
  try {
    // Get the user's recently visited boards from the database
    const userId = req.userId; // Assuming userId is attached to req object by verifyToken middleware
    const user = await User.findById(userId)
      .populate("recentlyVisitedBoards", "_id name")
      .exec();

    // If the user has recently visited boards, send them as response
    if (user && user.recentlyVisitedBoards.length > 0) {
      const boards = user.recentlyVisitedBoards;
      res.status(200).json({ boards });
    } else {
      // If no recently visited boards, send placeholder message
      res
        .status(200)
        .json({ message: "No boards found, please create or join one." });
    }
  } catch (error) {
    console.error("Error getting home boards:", error);
    res.status(500).json({ message: "Failed to get home boards." });
  }
};

// Function to get all Kanban Boards that the user belongs to
const getAllBoards = async (req, res) => {
  try {
    // Get all boards where the user is a member
    const userId = req.userId; // Assuming userId is attached to req object by verifyToken middleware
    const boards = await Board.find({ members: userId })
      .populate("createdBy", "_id name")
      .exec();
    res.status(200).json({ boards });
  } catch (error) {
    console.error("Error getting all boards:", error);
    res.status(500).json({ message: "Failed to get all boards." });
  }
};

// Function to create a new Kanban Board
const createBoard = async (req, res) => {
  try {
    const userId = req.userId; // Assuming userId is attached to req object by verifyToken middleware

    // Check if the user has already created a board
    const existingBoard = await Board.findOne({ createdBy: userId }).exec();
    if (existingBoard) {
      return res
        .status(400)
        .json({ message: "You can create only one board." });
    }

    // Assuming req.body contains necessary information to create a new board
    const { boardName } = req.body;

    if (!boardName) {
      return res.status(404).json({ message: "boardName is missing." });
    }

    // Create a new board in the database
    const board = await Board.create({
      name: boardName,
      createdBy: userId,
      members: [userId],
    });

    res.status(201).json({ board });
  } catch (error) {
    console.error("Error creating board:", error);
    res.status(500).json({ message: "Failed to create board." });
  }
};

// Function to get a single Kanban Board
const getOneBoard = async (req, res) => {
  try {
    const userId = req.userId; // Assuming userId is attached to req object by verifyToken middleware
    const { boardId } = req.params; // Extract boardId from route parameters

    // Find the board document by ID
    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({ message: "Board not found." });
    }

    // Add the visited board ID to the recentlyVisitedBoards array of the user
    const user = await User.findById(userId);

    if (user) {
      // Add the visited board ID to the recentlyVisitedBoards array
      if (user.recentlyVisitedBoards.includes(boardId)) {
        user.recentlyVisitedBoards.pull(boardId); // Remove boardId if it exists in the array
      }

      user.recentlyVisitedBoards.unshift(boardId); // Add boardId to the beginning of the array

      // Limit the array to a maximum number of board IDs (e.g., 3)
      const maxRecentBoards = 3;
      if (user.recentlyVisitedBoards.length > maxRecentBoards) {
        user.recentlyVisitedBoards.pop(); // Remove the oldest board ID
      }

      // Save the updated user document to the database
      await user.save();
    } else {
      console.error("User not found.");
    }

    res.status(200).json({ board });
  } catch (error) {
    console.error("Error getting board:", error);
    res.status(500).json({ message: "Failed to get board." });
  }
};

// Function to edit a Kanban Board
const editBoard = async (req, res) => {
  try {
    // Assuming req.params.boardId contains the ID of the board to be edited
    const boardId = req.params.boardId;

    if (!boardId) {
      return res.status(404).json({ message: "boardId is required." });
    }
    // Assuming req.body contains necessary information to update the board
    const { name } = req.body;

    // Find the board by ID and update its name
    const board = await Board.findByIdAndUpdate(
      boardId,
      { name },
      { new: true }
    ).exec();
    if (!board) {
      return res.status(404).json({ message: "Board not found." });
    }
    res.status(200).json({ board });
  } catch (error) {
    console.error("Error editing board:", error);
    res.status(500).json({ message: "Failed to edit board." });
  }
};

// Function to invite a user to a Kanban Board
const inviteUserToBoard = async (req, res) => {
  try {
    const boardId = req.params.boardId;
    const userId = req.userId; // Assuming userId is attached to req object by verifyToken middleware
    const { invitedUserId } = req.body; // Assuming req.body contains the ID of the user to be invited

    // Check if the board exists and the user making the request is its creator
    const board = await Board.findOne({
      _id: boardId,
      createdBy: userId,
    }).exec();

    if (!board) {
      return res
        .status(404)
        .json({ message: "Board not found or you are not the creator." });
    }

    // Check if the user to be invited exists
    const invitedUser = await User.findById(invitedUserId).exec();
    if (!invitedUser) {
      return res.status(404).json({ message: "Invited user not found." });
    }

    // Add the invited user to the board's members list
    if (!board.members.includes(invitedUserId)) {
      board.members.push(invitedUserId);
      await board.save();
    }

    res.status(200).json({ message: "User invited successfully." });
  } catch (error) {
    console.error("Error inviting user to board:", error);
    res.status(500).json({ message: "Failed to invite user to board." });
  }
};

module.exports = {
  getHomeBoards,
  getAllBoards,
  createBoard,
  getOneBoard,
  editBoard,
  inviteUserToBoard,
};
