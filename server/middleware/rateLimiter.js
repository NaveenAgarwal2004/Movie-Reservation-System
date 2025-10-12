const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth rate limiter (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  skipSuccessfulRequests: true,
  message: 'Too many login attempts, please try again later.',
});

// Password reset limiter
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: 'Too many password reset attempts, please try again later.',
});

// Per-user rate limiter (stored in memory, use Redis in production)
const userLimiters = new Map();

const perUserLimiter = (maxRequests = 50, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const userId = req.user?.userId;
    if (!userId) return next();

    const now = Date.now();
    const userKey = `user_${userId}`;

    let userLimit = userLimiters.get(userKey) || { count: 0, resetTime: now + windowMs };

    if (now > userLimit.resetTime) {
      userLimit = { count: 0, resetTime: now + windowMs };
    }

    userLimit.count++;
    userLimiters.set(userKey, userLimit);

    if (userLimit.count > maxRequests) {
      return res.status(429).json({
        message: 'Too many requests, please try again later.',
        retryAfter: Math.ceil((userLimit.resetTime - now) / 1000),
      });
    }

    next();
  };
};

module.exports = {
  apiLimiter,
  authLimiter,
  passwordResetLimiter,
  perUserLimiter,
};
