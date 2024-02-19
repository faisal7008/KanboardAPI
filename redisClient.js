const Redis = require('ioredis');

// Create a Redis client instance
const redisClient = new Redis({
  host: 'localhost', // Redis server host
  port: 6379, // Redis server port
  // Add more options as needed (e.g., password, TLS configuration)
});

// Handle connection errors
redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

module.exports = redisClient;
