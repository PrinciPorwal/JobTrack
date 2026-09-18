const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: [true, 'Parent Application ID is required'],
    },
    round: {
      type: String,
      enum: ['OA', 'TECHNICAL', 'SYSTEM_DESIGN', 'HR', 'OTHER'],
      default: 'TECHNICAL',
    },
    date: {
      type: Date,
      required: [true, 'Interview date is required'],
    },
    time: {
      type: String,
      default: '',
      trim: true,
    },
    interviewType: {
      type: String,
      enum: ['ONLINE', 'PHONE', 'ONSITE', 'VIDEO'],
      default: 'VIDEO',
    },
    meetingLink: {
      type: String,
      default: '',
      trim: true,
    },
    interviewer: {
      type: String,
      default: '',
      trim: true,
    },
    notes: {
      type: String,
      default: '',
    },
    result: {
      type: String,
      enum: ['PENDING', 'PASSED', 'FAILED', 'CANCELLED'],
      default: 'PENDING',
    },
  },
  {
    timestamps: true,
  }
);

interviewSchema.index({ date: 1 });
interviewSchema.index({ applicationId: 1 });

module.exports = mongoose.model('Interview', interviewSchema);
