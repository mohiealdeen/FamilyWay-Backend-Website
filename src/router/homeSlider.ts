import express from 'express';
const router = express.Router();
const { createSlider, sliders, deleteSlider, updateSlider } = require('../controller/homeSlider');
import multer from 'multer';
import path from 'path';
import { CATEGORIES_FILE_MAX } from '../constant/constant';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/upload/sliders');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
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
  .route('/homeSlider')
  .post(upload.single('file'), createSlider)
  .get(sliders);

router
  .route('/homeSlider/:id')
  .delete(deleteSlider)
  .put(updateSlider);

module.exports = router;
