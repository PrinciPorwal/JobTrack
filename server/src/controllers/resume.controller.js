const Resume = require('../models/Resume');

// @desc    Get current resume
// @route   GET /api/resume
exports.getResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne().sort({ updatedAt: -1 });
    res.status(200).json({
      success: true,
      data: resume || null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or replace current resume record
// @route   POST /api/resume
exports.saveResume = async (req, res, next) => {
  try {
    const { name, fileUrl } = req.body;

    if (!name || !fileUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both resume name and Google Drive fileUrl',
      });
    }

    // Delete existing resumes to guarantee single current resume record
    await Resume.deleteMany({});

    const resume = await Resume.create({
      name: name.trim(),
      fileUrl: fileUrl.trim(),
    });

    res.status(201).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete current resume
// @route   DELETE /api/resume
exports.deleteResume = async (req, res, next) => {
  try {
    await Resume.deleteMany({});
    res.status(200).json({
      success: true,
      message: 'Resume record deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
