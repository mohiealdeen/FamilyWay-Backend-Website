import express from 'express';
const router = express.Router();
const {
  createSubCategory,
  getAllSubCategory,
  getSubCategoryId,
  deleteCategory,
  getProductsInSub,
  updateSubCategory,
  getAllCompanies
} = require('../controller/subCategory');
const { protect, authorize } = require('../middleware/auth');
import path from 'path';
import multer from 'multer';
import { CATEGORIES_FILE_MAX } from '../constant/constant';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/upload/subCategories');
  },
  filename: function (req, file, cb) {
    let photoName = file.fieldname + '-' + Date.now() + path.extname(file.originalname);

    cb(null, photoName);
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
  .route('/subCategory')
  .post(protect, authorize('ADMIN'), upload.single('file'), createSubCategory)
  .get(getAllSubCategory);

router
  .route('/subCategory/:id')
  .get(getSubCategoryId)
  .delete(deleteCategory)
  .put(updateSubCategory);

router.route('/productsInSub/:id').get(getProductsInSub);

router.route("/allCompanies").get(getAllCompanies)

module.exports = router;
