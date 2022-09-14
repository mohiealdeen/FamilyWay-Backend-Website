import express from 'express';
import multer from 'multer';
const router = express.Router();
const { createCategory, allCategories, getParentCategory, deleteCategory, updateCategory } = require('../controller/parentCategory');
const { getAllCompanies } = require('../controller/Companies');
const { protect, authorize } = require('../middleware/auth');
import { CATEGORIES_FILE_MAX } from '../constant/constant';
import path from 'path';

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'src/upload/parentCategories')
//   },
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + '-' + Date.now() + path.extname(file.originalname)
//     )
//   }
// })

// let upload = multer({
//   storage: storage,
//   fileFilter: function (req, file, cb) {
//     if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
//       return cb(new Error('Only images are allowed'))
//     }
//     if (!file) {
//       return cb(new Error('image is required'))
//     }

//     if (file.size > CATEGORIES_FILE_MAX) {
//       return cb(new Error(`you must be less than ${CATEGORIES_FILE_MAX / 1000000} MB`))
//     }
//     cb(null, true)
//   }
// })
// , upload.single('file'),
router
  .route('/categories')
  .post(protect, authorize('ADMIN'), createCategory)
  .get(allCategories);

router
  .route('/categories/:id')
  .get(getParentCategory)
  .delete(deleteCategory);

router.route("/categories/:id").put(updateCategory)

router.route('/companies').get(getAllCompanies);

module.exports = router;
