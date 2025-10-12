const crypto = require('crypto');

// Simple CSRF protection middleware
const csrfProtection = () => {
  const tokens = new Map();

  return {
    generateToken: (req, res, next) => {
      const token = crypto.randomBytes(32).toString('hex');
      const userId = req.user?.userId || req.ip;

      tokens.set(userId, {
        token,
        createdAt: Date.now(),
      });

      // Clean up old tokens (older than 1 hour)
      for (const [key, value] of tokens.entries()) {
        if (Date.now() - value.createdAt > 60 * 60 * 1000) {
          tokens.delete(key);
        }
      }

      res.set('X-CSRF-Token', token);
      req.csrfToken = token;
      next();
    },

    verifyToken: (req, res, next) => {
      const token = req.headers['x-csrf-token'];
      const userId = req.user?.userId || req.ip;

      const stored = tokens.get(userId);

      if (!stored || stored.token !== token) {
        return res.status(403).json({ message: 'Invalid CSRF token' });
      }

      next();
    },
  };
};

module.exports = csrfProtection;
