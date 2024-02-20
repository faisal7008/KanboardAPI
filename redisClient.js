require('dotenv').config()
const Redis = require("ioredis");

// Create a Redis client instance
const redisClient = new Redis({
  // host: 'localhost', 
  // port: 6379,
  username: process.env.REDIS_CLOUD_USERNAME,
  password: process.env.REDIS_CLOUD_PASSWORD,
  host: process.env.REDIS_CLOUD_HOST,
  port: process.env.REDIS_CLOUD_PORT,
});

// Handle connection errors
redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

// Handle connection errors
redisClient.on("connect", () => {
  console.error("Redis server is connected...");
});


module.exports = redisClient;
