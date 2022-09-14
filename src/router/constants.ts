import express from 'express';
const router = express.Router();
const { getConstants, createConstant } = require('../controller/constants');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/constants')
  .post(protect, authorize('ADMIN'), createConstant)
  .get(protect, getConstants);

module.exports = router;
