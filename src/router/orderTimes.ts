import express from 'express'
const router = express.Router()
const {
  createOrderTime,
  getAllTimesOrder,
  UpdateTimesOrder,
  DeleteTimesOrder
} = require('../controller/orderTimes')
const { protect, authorize } = require('../middleware/auth.ts')

router
  .route('/orderTimes')
  .post(protect, createOrderTime)
  .get(protect, getAllTimesOrder)

router
  .route('/orderTimes/:id')
  .put(protect, UpdateTimesOrder)
  .delete(protect, DeleteTimesOrder)
module.exports = router
