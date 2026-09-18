const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');

// Route imports
const applicationRoutes = require('./routes/application.routes');
const interviewRoutes = require('./routes/interview.routes');
const resumeRoutes = require('./routes/resume.routes');
const analyticsRoutes = require('./routes/analytics.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'JobTrack API is operational',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/applications', applicationRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/analytics', analyticsRoutes);

// Catch 404 & Error Handler
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
