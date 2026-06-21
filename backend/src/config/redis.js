const redis = require('redis');
require('dotenv').config();

// Create Redis client (v6+ API)
const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error('❌ Redis: Too many reconnect attempts');
        return false; // Stop reconnecting
      }
      return Math.min(retries * 100, 3000); // Exponential backoff
    }
  },
  password: process.env.REDIS_PASSWORD || undefined
});

redisClient.on('connect', () => {
  console.log('✅ Redis client connected');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis error:', err.message);
});

redisClient.on('ready', () => {
  console.log('✅ Redis client ready');
});

module.exports = redisClient;
