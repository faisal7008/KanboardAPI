const Board = require("../models/Board");
const User = require("../models/User");
const redisClient = require("../redisClient");

// To get the user's last 3 visited Kanban Boards
const getHomeBoards = async (req, res) => {
  try {
    const userId = req.userId; // check verifyToken middleware

    // Caching homeBoards is avoided as it is frequently changing, and fetching only 3 boards each time means the fetching time will be minimal regardless of caching.

    const user = await User.findById(userId)
      .populate("recentlyVisitedBoards", "_id name")
      .exec();

    // If the user has recently visited boards, send them as response
    if (user && user.recentlyVisitedBoards.length > 0) {
      const boards = user.recentlyVisitedBoards;
      // Return fetched data
      res.status(200).json({ boards });
    } else {
      // If no recently visited boards, send placeholder message
      res
        .status(200)
        .json({ message: "No boards found, please create or join one." });
    }
  } catch (error) {
    console.error("Error getting home boards:", error);
    res
      .status(500)
      .json({ message: "Failed to get home boards.", details: error.message });
  }
};

// To get all Kanban Boards that the user belongs to
const getAllBoards = async (req, res) => {
  try {
    const userId = req.userId; // check verifyToken middleware
    const boardsCacheKey = `boards:${userId}`;

    // Check if data is cached
    const cachedData = await redisClient.get(boardsCacheKey);
    if (cachedData) {
      // Data found in cache, return cached data
      return res.status(200).json(JSON.parse(cachedData));
    }

    // Data not found in cache, fetch from database
    const boards = await Board.find({ members: userId })
      .populate("createdBy", "_id name")
      .exec();
    // Cache the fetched data
    await redisClient.setex(boardsCacheKey, 3600, JSON.stringify(boards)); // Cache for 1 hour

    // Return fetched data
    res.status(200).json({ boards });
  } catch (error) {
    console.error("Error getting all boards:", error);
    res
      .status(500)
      .json({ message: "Failed to get all boards.", details: error.message });
  }
};

// To create a new Kanban Board
const createBoard = async (req, res) => {
  try {
    const userId = req.userId; // check verifyToken middleware

    // Check if the user has already created a board
    const existingBoard = await Board.findOne({ createdBy: userId }).exec();
    if (existingBoard) {
      return res
        .status(400)
        .json({ message: "You can create only one board." });
    }

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

    // Clear the cached boards
    const boardsCacheKey = `boards:${userId}`;
    redisClient.del(boardsCacheKey);

    res.status(201).json({ board });
  } catch (error) {
    console.error("Error creating board:", error);
    res
      .status(500)
      .json({ message: "Failed to create board.", details: error.message });
  }
};

// To get a single Kanban Board
const getOneBoard = async (req, res) => {
  try {
    const userId = req.userId; // check verifyToken middleware
    const { boardId } = req.params;

    const boardCacheKey = `board:${boardId}`;

    // Check if data is cached
    const cachedData = await redisClient.get(boardCacheKey);
    if (cachedData) {
      // Data found in cache, return cached data
      return res.status(200).json(JSON.parse(cachedData));
    }

    // Data not found in cache, fetch from database

    // Find the board by ID
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found." });
    }
    // Add the visited board ID to the recentlyVisitedBoards array of the user
    const user = await User.findById(userId);
    // Add the visited board ID to the recentlyVisitedBoards array
    if (user) {
      if (user.recentlyVisitedBoards.includes(boardId)) {
        user.recentlyVisitedBoards.pull(boardId); // Remove boardId if it exists in the array
      }
      user.recentlyVisitedBoards.unshift(boardId); // Add boardId to the beginning of the array
      const maxRecentBoards = 3;
      if (user.recentlyVisitedBoards.length > maxRecentBoards) {
        user.recentlyVisitedBoards.pop(); // Remove the oldest board ID from the end
      }

      await user.save();
    } else {
      console.error("User not found.");
    }

    // Cache the fetched data
    await redisClient.setex(boardCacheKey, 3600, JSON.stringify(board));

    res.status(200).json({ board });
  } catch (error) {
    console.error("Error getting board:", error);
    res
      .status(500)
      .json({ message: "Failed to get board.", details: error.message });
  }
};

// To edit a Kanban Board
const editBoard = async (req, res) => {
  try {
    const boardId = req.params.boardId;

    if (!boardId) {
      return res.status(404).json({ message: "boardId is required." });
    }

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

    // Clear the cached board
    const boardCacheKey = `board:${boardId}`;
    redisClient.del(boardCacheKey);

    res.status(200).json({ board });
  } catch (error) {
    console.error("Error editing board:", error);
    res
      .status(500)
      .json({ message: "Failed to edit board.", details: error.message });
  }
};

// To invite a user to a Kanban Board
const inviteUserToBoard = async (req, res) => {
  try {
    const userId = req.userId; // check verifyToken middleware
    const boardId = req.params.boardId;
    const { invitedUserId } = req.body;

    if (!invitedUserId) {
      return res.status(404).json({ message: "invitedUserId is required." });
    }

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
      return res
        .status(404)
        .json({ message: "Invited user not found.", details: error.message });
    }

    // Add the invited user to the board's members list
    if (!board.members.includes(invitedUserId)) {
      board.members.push(invitedUserId);
      await board.save();
    }

    // Clear the cached boards
    const boardsCacheKey = `boards:${userId}`;
    redisClient.del(boardsCacheKey);
    // Clear the cached board
    const boardCacheKey = `board:${boardId}`;
    redisClient.del(boardCacheKey);

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
