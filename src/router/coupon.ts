import express from 'express'
const router = express.Router()
const {
  createCoupon,
  getAllCoupons,
  connectCoupon,
  deleteCoupons
} = require('../controller/coupon')
const { protect, authorize } = require('../middleware/auth')

router
  .route('/coupon')
  .post(protect, authorize('ADMIN'), createCoupon)
  .get(getAllCoupons)
router.route('/connectCoupon').post(protect, connectCoupon)
router.route("/coupon/:id").delete(protect,deleteCoupons)
module.exports = router
