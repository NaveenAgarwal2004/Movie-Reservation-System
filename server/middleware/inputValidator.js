const validator = require('validator');

// Sanitize string input
const sanitizeString = (input) => {
  if (typeof input !== 'string') return input;
  return validator.escape(validator.trim(input));
};

// Validate and sanitize email
const validateEmail = (email) => {
  if (!validator.isEmail(email)) {
    throw new Error('Invalid email format');
  }
  return validator.normalizeEmail(email);
};

// Validate phone number
const validatePhone = (phone) => {
  const cleaned = phone.replace(/[^\d+]/g, '');
  if (cleaned.length < 10) {
    throw new Error('Invalid phone number');
  }
  return cleaned;
};

// Sanitize object recursively
const sanitizeObject = (obj) => {
  const sanitized = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = Array.isArray(value)
        ? value.map((item) => (typeof item === 'string' ? sanitizeString(item) : item))
        : sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

// Middleware to sanitize request body
const sanitizeBody = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  next();
};

// Validate password strength
const validatePasswordStrength = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }

  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    return { valid: false, message: 'Password must contain uppercase, lowercase, and numbers' };
  }

  return { valid: true };
};

module.exports = {
  sanitizeString,
  validateEmail,
  validatePhone,
  sanitizeObject,
  sanitizeBody,
  validatePasswordStrength,
};
