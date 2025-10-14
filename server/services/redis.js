const redis = require('redis');

let client;
let isConnected = false;

const initRedis = async () => {
  // Skip Redis in test environment
  if (process.env.NODE_ENV === 'test') {
    console.log('⚠️ Test mode: Using in-memory fallback instead of Redis');
    return createInMemoryClient();
  }

  // Check if Redis is configured
  if (!process.env.REDIS_HOST) {
    console.log('⚠️ Redis not configured, using in-memory fallback');
    return createInMemoryClient();
  }

  try {
    client = redis.createClient({
      socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379'),
        connectTimeout: 5000,
      },
      password: process.env.REDIS_PASSWORD || undefined,
    });

    client.on('error', (err) => {
      console.error('❌ Redis Client Error:', err.message);
      isConnected = false;
    });

    client.on('connect', () => {
      console.log('✅ Connected to Redis');
      isConnected = true;
    });

    client.on('ready', () => {
      console.log('✅ Redis is ready');
    });

    client.on('end', () => {
      console.log('⚠️ Redis connection closed');
      isConnected = false;
    });

    await client.connect();
    return client;
  } catch (error) {
    console.error('❌ Redis connection failed:', error.message);
    console.log('⚠️ Falling back to in-memory cache');
    return createInMemoryClient();
  }
};

// In-memory fallback
function createInMemoryClient() {
  if (!global.inMemoryStore) {
    global.inMemoryStore = new Map();
  }

  return {
    get: async (key) => {
      return global.inMemoryStore.get(key) || null;
    },
    set: async (key, value, options) => {
      global.inMemoryStore.set(key, value);
      if (options && options.EX) {
        setTimeout(() => {
          global.inMemoryStore.delete(key);
        }, options.EX * 1000);
      }
      return 'OK';
    },
    del: async (key) => {
      global.inMemoryStore.delete(key);
      return 1;
    },
    exists: async (key) => {
      return global.inMemoryStore.has(key) ? 1 : 0;
    },
    disconnect: async () => {
      console.log('In-memory cache cleared');
    },
  };
}

// Initialize and export
const redisClient = initRedis();

module.exports = redisClient;
