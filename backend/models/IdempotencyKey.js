const mongoose = require('mongoose');

const idempotencyKeySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
      required: true,
    },
    status: {
      type: String,
      enum: ['processing', 'resolved', 'failed'],
      required: true,
      default: 'processing',
    },
    responseStatus: {
      type: Number,
    },
    responseBody: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-expire documents after 24 hours (86400 seconds)
idempotencyKeySchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model('IdempotencyKey', idempotencyKeySchema);
