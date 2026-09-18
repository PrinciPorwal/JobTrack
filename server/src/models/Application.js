const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    jobUrl: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    workMode: {
      type: String,
      enum: ['REMOTE', 'HYBRID', 'ONSITE'],
      default: 'REMOTE',
    },
    employmentType: {
      type: String,
      enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'],
      default: 'FULL_TIME',
    },
    salaryMin: {
      type: Number,
      default: null,
    },
    salaryMax: {
      type: Number,
      default: null,
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['SAVED', 'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN'],
      default: 'SAVED',
    },
    source: {
      type: String,
      enum: [
        'LinkedIn',
        'Company Website',
        'Referral',
        'Naukri',
        'Indeed',
        'Wellfound',
        'Other',
      ],
      default: 'LinkedIn',
    },
    recruiter: {
      name: { type: String, trim: true, default: '' },
      email: { type: String, trim: true, default: '' },
      linkedin: { type: String, trim: true, default: '' },
    },
    jobDescription: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ status: 1 });
applicationSchema.index({ applicationDate: -1 });
applicationSchema.index({ company: 1, jobTitle: 1 });

module.exports = mongoose.model('Application', applicationSchema);
