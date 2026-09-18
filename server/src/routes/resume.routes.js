const express = require('express');
const router = express.Router();
const {
  getResume,
  saveResume,
  deleteResume,
} = require('../controllers/resume.controller');

router.route('/')
  .get(getResume)
  .post(saveResume)
  .delete(deleteResume);

module.exports = router;
