import express from 'express'
const router = express.Router()
const {
  create,
  validate,
  changeNumber,
  validateChangeNumber
} = require('../controller/validatePhoneNumber')
const { protect } = require('../middleware/auth')

router.route('/phoneNumber').post(create)

router.route('/phoneNumber/validate').post(validate)

router.route('/phoneNumber/changePhone').post(protect, changeNumber)

router
  .route('/phoneNumber/validateChangePhone')
  .post(protect, validateChangeNumber)

module.exports = router
