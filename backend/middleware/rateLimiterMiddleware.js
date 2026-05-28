const { AppError } = require('../utils/errorHandler');

const requestLogs = new Map();

const WINDOW_MS = 60000;
const MAX_REQUESTS = 5;
const CLEANUP_INTERVAL_MS = 600000;

setInterval(() => {
  const now = Date.now();
  for (const [key, timestamps] of requestLogs) {
    const valid = timestamps.filter(ts => now - ts < WINDOW_MS);
    if (valid.length === 0) {
      requestLogs.delete(key);
    } else {
      requestLogs.set(key, valid);
    }
  }
}, CLEANUP_INTERVAL_MS);

const rateLimiter = (req, res, next) => {
  const key = (req.user && req.user.id) || req.ip;
  const now = Date.now();
  let timestamps = requestLogs.get(key) || [];
  timestamps = timestamps.filter(ts => now - ts < WINDOW_MS);
  if (timestamps.length >= MAX_REQUESTS) {
    return next(new AppError('Too many requests. Only 5 requests per minute are allowed.', 429));
  }
  timestamps.push(now);
  requestLogs.set(key, timestamps);
  next();
};

module.exports = rateLimiter;
