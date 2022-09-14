import express from 'express';
const router = express.Router();
const {
  createThirdCategory,
  getThirdCategoryId,
  deleteCategory,
  getAllThirdCategory,
  updateThirdById
} = require('../controller/thirdCategory');
const { protect, authorize } = require('../middleware/auth');
import path from 'path';
import multer from 'multer';
import { CATEGORIES_FILE_MAX } from '../constant/constant';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/upload/thirdCategory');
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
    if (!file) {
      return cb(new Error('image is required'));
    }

    if (file.size > CATEGORIES_FILE_MAX) {
      return cb(new Error(`you must be less than ${CATEGORIES_FILE_MAX / 1000000} MB`));
    }
    cb(null, true);
  }
});

router
  .route('/thirdCategory')
  .post(protect, authorize('ADMIN'), upload.single('file'), createThirdCategory)
  .get(getAllThirdCategory);
// .get(getAllSubCategory)

router
  .route('/thirdCategory/:id')
  .get(getThirdCategoryId)
  .delete(deleteCategory)
  .put(updateThirdById);

module.exports = router;
