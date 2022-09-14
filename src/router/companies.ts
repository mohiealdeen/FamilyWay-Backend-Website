import express from 'express';
const router = express.Router();
const { createSliderCompanies, getAllSlidersCompanies, deleteSliderCompany } = require('../controller/homeSlider');
import { CATEGORIES_FILE_MAX } from '../constant/constant';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/upload/companies');
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

    if (file.size > 100000) {
      return cb(new Error(`you must be less than ${CATEGORIES_FILE_MAX / 1000000} MB`));
    }
    cb(null, true);
  }
});

router.route('/companies').post(upload.single('image'), createSliderCompanies);

router.route('/getCompanies').get(getAllSlidersCompanies);

router.route('/companies/:id').delete(deleteSliderCompany);

module.exports = router;
