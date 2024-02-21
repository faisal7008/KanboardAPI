const express = require("express");
const cors = require('cors');
require("dotenv").config();
const { connectDB } = require("./config/db");
const rateLimit = require("express-rate-limit");

const app = express();

// Enable Cross-Origin Resource Sharing (CORS) middleware
app.use(cors({ origin: true, credentials: true }));

// Parse incoming request bodies as JSON
app.use(express.json());

// Parse incoming request bodies as URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Define the port for the server to listen on
const port = process.env.PORT || 9000;

// Start the server and listen on the defined port
app.listen(port, () => {
  console.log("Server running on " + port); 
  console.log("Waiting for DB to connect...");
});

// Connect to the database
connectDB();

// Welcome message route
app.get("/", (req, res) => {
  res.send("Welcome to Kanboard API");
});

// Define rate limiting options
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 500, // 500 requests per windowMs
  message: 'You have exceeded the 500 requests in 1 min limit!', 
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

const authRouter = require("./routes/authRoutes");
const boardRouter = require("./routes/boardRoutes");
const taskRouter = require("./routes/taskRoutes");

// Routes
app.use("/auth", authRouter);
app.use("/api/boards", boardRouter);

// Nested route for tasks under a specific board
app.use("/api/boards/:boardId/tasks", taskRouter);
