const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  time: {
    type: String,
  },
  type: {
    type: String,
    enum: ['flight', 'hotel', 'train', 'activity', 'other'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  location: {
    type: String,
  },
});

const daySchema = new mongoose.Schema({
  dayNumber: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  activities: [activitySchema],
});

const itinerarySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
    },
    title: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    days: [daySchema],
    shareToken: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

itinerarySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Itinerary', itinerarySchema);
