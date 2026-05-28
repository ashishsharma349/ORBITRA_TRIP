const IdempotencyKey = require('../models/IdempotencyKey');
const { AppError } = require('../utils/errorHandler');
const { HTTP_STATUS } = require('../utils/constants');

const idempotency = async (req, res, next) => {
  try {
    const key = req.headers['idempotency-key'];
    if (!key) {
      return next(new AppError('Idempotency-Key header is required', HTTP_STATUS.BAD_REQUEST));
    }

    if (typeof key !== 'string' || key.trim() === '' || key.length > 256) {
      return next(new AppError('Invalid Idempotency-Key format', HTTP_STATUS.BAD_REQUEST));
    }

    const userId = req.user?.id;
    if (!userId) {
      return next(new AppError('Authentication required for idempotency checks', HTTP_STATUS.UNAUTHORIZED));
    }

    let record;
    try {
      record = await IdempotencyKey.create({
        key,
        userId,
        status: 'processing',
      });
    } catch (err) {
      if (err.code === 11000) {
        // Unique key constraint violation. Find the existing document.
        const existing = await IdempotencyKey.findOne({ key });
        if (!existing) {
          // If it was deleted by TTL or manually in between, try creating it again.
          record = await IdempotencyKey.create({
            key,
            userId,
            status: 'processing',
          });
        } else {
          // Security Check: Verify ownership
          if (existing.userId.toString() !== userId.toString()) {
            return next(new AppError('Idempotency-Key belongs to a different user', HTTP_STATUS.FORBIDDEN));
          }

          if (existing.status === 'processing') {
            return next(new AppError('A request with this Idempotency-Key is already in progress', HTTP_STATUS.CONFLICT));
          }

          if (existing.status === 'resolved') {
            return res.status(existing.responseStatus).json(existing.responseBody);
          }

          if (existing.status === 'failed') {
            // Re-attempting a failed request. Delete the old failed key and create a new one.
            await IdempotencyKey.deleteOne({ _id: existing._id });
            record = await IdempotencyKey.create({
              key,
              userId,
              status: 'processing',
            });
          }
        }
      } else {
        throw err;
      }
    }

    // Intercept send and json methods to cache response details
    const originalSend = res.send;
    const originalJson = res.json;

    res.json = function (body) {
      res.locals.idempotencyBody = body;
      return originalJson.apply(this, arguments);
    };

    res.send = function (body) {
      if (res.locals.idempotencyBody === undefined) {
        res.locals.idempotencyBody = body;
      }
      return originalSend.apply(this, arguments);
    };

    res.on('finish', async () => {
      try {
        const statusCode = res.statusCode;
        // Cache only 2xx successful responses
        if (statusCode >= 200 && statusCode < 300) {
          let body = res.locals.idempotencyBody;
          if (typeof body === 'string') {
            try {
              body = JSON.parse(body);
            } catch (e) {
              // Standard text, leave as is
            }
          }
          await IdempotencyKey.updateOne(
            { _id: record._id },
            {
              status: 'resolved',
              responseStatus: statusCode,
              responseBody: body,
            }
          );
        } else {
          // Clean up key if request failed or was a client error (except 409 etc. but simpler is deleting failed key so it can be retried)
          await IdempotencyKey.deleteOne({ _id: record._id });
        }
      } catch (e) {
        console.error('Failed to update idempotency key:', e);
      }
    });

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  idempotency,
};
