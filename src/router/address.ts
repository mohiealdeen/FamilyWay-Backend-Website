import express from 'express'
const router = express.Router()
const {
  createAddress,
  deleteAddress,
  getAddress,
  updateAddressPrim
} = require('../controller/address')
const { protect } = require('../middleware/auth')

router
  .route('/address')
  .post(protect, createAddress)
  .get(protect, getAddress)

router
  .route('/address/:id')
  .delete(protect, deleteAddress)
  .put(protect, updateAddressPrim)

module.exports = router
