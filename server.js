const express = require("express");
const cors = require('cors');
require("dotenv").config();
const { connectDB } = require("./config/db");

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

const authRouter = require("./routes/authRoutes");
const boardRouter = require("./routes/boardRoutes");

// routes
app.use("/auth", authRouter)
app.use("/api/boards", boardRouter)
