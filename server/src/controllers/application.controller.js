const Application = require('../models/Application');
const Interview = require('../models/Interview');

// @desc    Create a new job application
// @route   POST /api/applications
exports.createApplication = async (req, res, next) => {
  try {
    const application = await Application.create(req.body);
    res.status(201).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications (with optional regex search and status filtering)
// @route   GET /api/applications
exports.getApplications = async (req, res, next) => {
  try {
    const { search, status, workMode } = req.query;
    const filter = {};

    if (search && search.trim() !== '') {
      const term = search.trim();
      filter.$or = [
        { company: { $regex: term, $options: 'i' } },
        { jobTitle: { $regex: term, $options: 'i' } },
      ];
    }

    if (status && status !== 'ALL') {
      filter.status = status;
    }

    if (workMode && workMode !== 'ALL') {
      filter.workMode = workMode;
    }

    const applications = await Application.find(filter).sort({ applicationDate: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single application by ID (with related interviews)
// @route   GET /api/applications/:id
exports.getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    const interviews = await Interview.find({ applicationId: application._id }).sort({ date: 1 });

    res.status(200).json({
      success: true,
      data: {
        ...application.toObject(),
        interviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application
// @route   PUT /api/applications/:id
exports.updateApplication = async (req, res, next) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status only
// @route   PATCH /api/applications/:id/status
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['SAVED', 'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete application and its related interviews
// @route   DELETE /api/applications/:id
exports.deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Cascade delete associated interviews
    await Interview.deleteMany({ applicationId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Application and associated interviews deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
