const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Resume title/name is required'],
      trim: true,
    },
    fileUrl: {
      type: String,
      required: [true, 'Resume Google Drive URL is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Resume', resumeSchema);
