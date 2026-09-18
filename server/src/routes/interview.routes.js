const express = require('express');
const router = express.Router();
const {
  createInterview,
  getInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
} = require('../controllers/interview.controller');

router.route('/')
  .post(createInterview)
  .get(getInterviews);

router.route('/:id')
  .get(getInterviewById)
  .put(updateInterview)
  .delete(deleteInterview);

module.exports = router;
