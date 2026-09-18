const Application = require('../models/Application');
const Interview = require('../models/Interview');

// @desc    Get dashboard summary statistics
// @route   GET /api/analytics/dashboard
exports.getDashboardSummary = async (req, res, next) => {
  try {
    const totalApplications = await Application.countDocuments();

    // Status counts
    const statusCountsRaw = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const statuses = ['SAVED', 'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN'];
    const statusBreakdown = {};
    statuses.forEach((s) => {
      statusBreakdown[s] = 0;
    });

    statusCountsRaw.forEach((item) => {
      if (item._id) {
        statusBreakdown[item._id] = item.count;
      }
    });

    // Recent 5 applications
    const recentApplications = await Application.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('company jobTitle status applicationDate location workMode');

    // Interviews counts
    const totalInterviews = await Interview.countDocuments();
    const pendingInterviews = await Interview.countDocuments({ result: 'PENDING' });

    // Upcoming interviews (pending, sorted by date asc)
    const upcomingInterviews = await Interview.find({
      result: 'PENDING',
    })
      .populate('applicationId', 'company jobTitle location')
      .sort({ date: 1, time: 1 })
      .limit(4);

    res.status(200).json({
      success: true,
      data: {
        totalApplications,
        statusBreakdown,
        totalInterviews,
        pendingInterviews,
        recentApplications,
        upcomingInterviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get monthly application counts for analytics chart
// @route   GET /api/analytics/monthly
exports.getMonthlyAnalytics = async (req, res, next) => {
  try {
    const monthlyData = await Application.aggregate([
      {
        $project: {
          year: { $year: '$applicationDate' },
          month: { $month: '$applicationDate' },
        },
      },
      {
        $group: {
          _id: { year: '$year', month: '$month' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const formattedData = monthlyData.map((item) => {
      const monthIndex = (item._id.month || 1) - 1;
      const monthName = monthNames[monthIndex] || `M${item._id.month}`;
      const year = item._id.year || new Date().getFullYear();
      return {
        key: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
        label: `${monthName} ${year}`,
        month: monthName,
        year: year,
        applications: item.count,
      };
    });

    res.status(200).json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    next(error);
  }
};
