const redisClient = require('../services/redis');

// Cache middleware for GET requests
const cacheMiddleware = (duration = 300) => {
  return async (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl}`;

    try {
      const cachedData = await redisClient.get(key);

      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }

      // Store original res.json function
      const originalJson = res.json.bind(res);

      // Override res.json to cache the response
      res.json = (data) => {
        redisClient.set(key, JSON.stringify(data), {
          EX: duration,
        });
        return originalJson(data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

// Clear cache by pattern
const clearCache = async (pattern) => {
  try {
    // Note: This works with in-memory fallback
    if (global.inMemoryStore) {
      for (const key of global.inMemoryStore.keys()) {
        if (key.includes(pattern)) {
          global.inMemoryStore.delete(key);
        }
      }
    }
  } catch (error) {
    console.error('Clear cache error:', error);
  }
};

module.exports = {
  cacheMiddleware,
  clearCache,
};
