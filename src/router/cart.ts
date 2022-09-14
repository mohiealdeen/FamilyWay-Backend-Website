import express from 'express';
const router = express.Router();
const { addToCart, getCartItem, add, decrementAndDelete, removeAll } = require('../controller/cart');
const { protect } = require('../middleware/auth');

router
  .route('/cart')
  .post(protect, add)
  .get(protect, getCartItem)
  .delete(protect,removeAll);

router.route('/cart/deleteAndDecrease').post(protect, decrementAndDelete);

module.exports = router;
