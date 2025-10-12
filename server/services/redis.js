const redis = require('redis');

let client;
let errorLogged = false;

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction && !process.env.REDIS_HOST) {
  console.log('No Redis host in production, using in-memory fallback');
  // Fallback to in-memory storage
  client = {
    set: (key, value, options) => {
      // In-memory fallback
      if (!global.inMemoryStore) {
        global.inMemoryStore = new Map();
      }
      global.inMemoryStore.set(key, value);

      if (options && options.EX) {
        setTimeout(() => {
          global.inMemoryStore.delete(key);
        }, options.EX * 1000);
      }

      return Promise.resolve();
    },
    get: (key) => {
      if (!global.inMemoryStore) {
        global.inMemoryStore = new Map();
      }
      return Promise.resolve(global.inMemoryStore.get(key));
    },
    del: (key) => {
      if (!global.inMemoryStore) {
        global.inMemoryStore = new Map();
      }
      global.inMemoryStore.delete(key);
      return Promise.resolve();
    },
    exists: (key) => {
      if (!global.inMemoryStore) {
        global.inMemoryStore = new Map();
      }
      return Promise.resolve(global.inMemoryStore.has(key) ? 1 : 0);
    },
  };
} else {
  try {
    client = redis.createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
    });

    client.on('error', (err) => {
      if (!errorLogged) {
        console.error('Redis Client Error:', err);
        errorLogged = true;
      }
    });

    client.on('connect', () => {
      console.log('Connected to Redis');
    });

    // Connect to Redis
    client.connect();
  } catch (error) {
    console.error('Redis connection failed:', error);
    // Fallback to in-memory storage
    client = {
      set: (key, value, options) => {
        // In-memory fallback
        if (!global.inMemoryStore) {
          global.inMemoryStore = new Map();
        }
        global.inMemoryStore.set(key, value);

        if (options && options.EX) {
          setTimeout(() => {
            global.inMemoryStore.delete(key);
          }, options.EX * 1000);
        }

        return Promise.resolve();
      },
      get: (key) => {
        if (!global.inMemoryStore) {
          global.inMemoryStore = new Map();
        }
        return Promise.resolve(global.inMemoryStore.get(key));
      },
      del: (key) => {
        if (!global.inMemoryStore) {
          global.inMemoryStore = new Map();
        }
        global.inMemoryStore.delete(key);
        return Promise.resolve();
      },
      exists: (key) => {
        if (!global.inMemoryStore) {
          global.inMemoryStore = new Map();
        }
        return Promise.resolve(global.inMemoryStore.has(key) ? 1 : 0);
      },
    };
  }
}

module.exports = client;
