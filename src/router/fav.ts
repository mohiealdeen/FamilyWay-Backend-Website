import express from 'express'
const router = express.Router()
const { addToFav, getFav } = require('../controller/fav')
const { protect } = require('../middleware/auth')

router
  .route('/fav')
  .post(protect, addToFav)
  .get(protect, getFav)

module.exports = router
