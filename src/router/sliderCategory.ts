import express from 'express';
const router = express.Router();
const { createSliderCategory, getSliderCategoryById, deleteSlider } = require('../controller/sliderCategory');
import multer from 'multer';
import { CATEGORIES_FILE_MAX } from '../constant/constant';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/upload/sliderCategory');
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

router.route('/sliderCategory').post(upload.single('file'), createSliderCategory);
router
  .route('/sliderCategory/:id')
  .get(getSliderCategoryById)
  .delete(deleteSlider);

module.exports = router;
