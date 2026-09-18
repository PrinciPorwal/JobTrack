const Interview = require('../models/Interview');
const Application = require('../models/Application');

// @desc    Create a new interview record
// @route   POST /api/interviews
exports.createInterview = async (req, res, next) => {
  try {
    const { applicationId } = req.body;

    // Verify parent application exists
    const appExists = await Application.findById(applicationId);
    if (!appExists) {
      return res.status(404).json({
        success: false,
        message: 'Parent application not found for this interview',
      });
    }

    const interview = await Interview.create(req.body);

    // If application status is still SAVED or APPLIED, move it to INTERVIEW stage
    if (appExists.status === 'SAVED' || appExists.status === 'APPLIED') {
      appExists.status = 'INTERVIEW';
      await appExists.save();
    }

    const populatedInterview = await Interview.findById(interview._id).populate(
      'applicationId',
      'company jobTitle status'
    );

    res.status(201).json({
      success: true,
      data: populatedInterview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all interviews (with optional filter by applicationId)
// @route   GET /api/interviews
exports.getInterviews = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.applicationId) {
      filter.applicationId = req.query.applicationId;
    }

    const interviews = await Interview.find(filter)
      .populate('applicationId', 'company jobTitle status location workMode')
      .sort({ date: 1, time: 1 });

    res.status(200).json({
      success: true,
      count: interviews.length,
      data: interviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single interview by ID
// @route   GET /api/interviews/:id
exports.getInterviewById = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id).populate(
      'applicationId',
      'company jobTitle status location workMode'
    );

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    res.status(200).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update interview
// @route   PUT /api/interviews/:id
exports.updateInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('applicationId', 'company jobTitle status location workMode');

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    res.status(200).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete interview
// @route   DELETE /api/interviews/:id
exports.deleteInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findByIdAndDelete(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Interview deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
