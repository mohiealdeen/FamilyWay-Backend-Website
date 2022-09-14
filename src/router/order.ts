import express from 'express';
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrdersById,
  updateOrder,
  removeOrder,
  getOrdersInDays,
  applyDriver,
  getOrdersForAdmin
} = require('../controller/order');
const { protect } = require('../middleware/auth');
import multer from 'multer';
import { CATEGORIES_FILE_MAX } from '../constant/constant';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/upload/bills');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

let upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
      return cb(new Error('Only images are allowed'));
    }
    cb(null, true);
  }
});

router
  .route('/order')
  .post(protect, createOrder)
  .get(protect, getOrders);

router
  .route('/order/:id')
  .get(protect, getOrdersById)
  .put(protect, upload.array('files', 100), updateOrder)
  .delete(protect, removeOrder);

router.route('/ordersHistory').get(getOrdersInDays);

router.route('/applyOrder/:orderId').post(applyDriver);

router.route('/getOrdersForAdmin').get(getOrdersForAdmin);

module.exports = router;
