import express from 'express'
const router = express.Router()
const { getTime, updateTime } = require('../controller/time')
const { protect, authorize } = require('../middleware/auth')

router
  .route('/time')
  .get(getTime)
  .put(protect, authorize('ADMIN'), updateTime)

module.exports = router
