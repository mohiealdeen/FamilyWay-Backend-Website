import express, { Request, Response } from 'express';
const router = express.Router();
const {
  createProduct,
  getProductsByCat,
  getOneProductById,
  deleteOneProductById,
  updateProduct,
  getProductsBySearch,
  replaceProduct,
  getProductByBarCode,
  getRelatedProducts,
  getAllProducts,
  getProductsHasADiscount,
  createXLSFile,
  getXLSFiles,
  deleteFileXLS
} = require('../controller/product');

const { createProductsSeeder } = require('../controller/Seeder');
const { protect, authorize } = require('../middleware/auth');
import multer from 'multer';
import path from 'path';
import { CATEGORIES_FILE_MAX } from '../constant/constant';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/upload/products');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

var upload = multer({
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

router.route('/products/search').post(getProductsBySearch);

router
  .route('/products')
  .post(protect, authorize('ADMIN'), upload.fields([{ name: 'files', maxCount: 8 }]), createProduct);

router.route('/products/:id').get(getProductsByCat);

router
  .route('/oneProduct/:id')
  .get(getOneProductById)
  .delete(deleteOneProductById);

router.route('/oneProduct/:id').put(protect, authorize('ADMIN'), updateProduct);

router.route('/replaceProduct/:id').put(protect, replaceProduct);

router.route('/searchBarCode').get(getProductByBarCode);

router.route('/related/:id').post(getRelatedProducts);

router.route('/productsSeeder').post(createProductsSeeder);

router.route('/allProducts').get(getAllProducts);

router.route('/productsHasADiscount/:id').get(getProductsHasADiscount);

router
  .route('/productsRoute')
  .post(createXLSFile)
  .get(getXLSFiles);

router.route('/productsRoute/:name').delete(deleteFileXLS);

module.exports = router;
