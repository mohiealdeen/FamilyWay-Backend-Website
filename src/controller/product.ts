import { Request, Response, NextFunction } from 'express';
import productModel, { Product } from '../model/productModel';
import ProductsFunctions from '../Config/productsFunctions';
import { User } from '../model/userModel';
import fs from 'fs';
import Jimp from 'jimp';
import thirdCategoryModel from '../model/thirdCategoryModel';
// @ts-ignore
import json2xls from 'json2xls';

interface Pagination {
  startIndex: number;
  skip: number;
  pagination: object;
  limit: number;
  totalItems: number;
}

exports.createProduct = async (req: Request & { file: { image: any } }, res: Response) => {
  try {
    var {
      title,
      details,
      categories,
      price,
      discount,
      discountEnds,
      barCode,
      increaseCount,
      variationId,
      unit,
      userMax,
      inStock,
      boxUnit,
      // isCard
    } = req.body;
    const images = req.files;
    const { files }: any = images;
    const now: Date = new Date();

    if (discountEnds) {
      discountEnds = new Date(discountEnds);
      if (now > discountEnds) {
        return res.status(401).json({ message: 'Discount is Wrong' });
      }
    }

    var productImages: Array<string> = [];
    files.forEach((item: any) => {
      productImages.push(item.filename);
    });

    const allProducts = await productModel.find({ barCode });
    if (allProducts.length === 0 || allProducts === undefined) {
      // const third: any = await thirdCategoryModel.findOne({ _id: categories });

      const product = await productModel.create({
        title,
        details,
        categories,
        price,
        discount,
        discountEnds: discount ? discountEnds : undefined,
        barCode,
        images: productImages,
        increaseCount,
        variationId,
        unit,
        boxUnit,
        userMax,
        inStock,
        // isCard
      });
      // @ts-ignore
      const uploadPath: string = __dirname + '/../upload/products/' + req.files.files[0].filename;
      try {
        const img = await Jimp.read(uploadPath);
        // @ts-ignore
        img.resize(300, Jimp.AUTO).write(__dirname + '/../upload/products/' + req.files.files[0].filename);
      } catch (error) {
        if (error) return res.json(error);
      }

      res.status(200).json({ message: 'Product Created', product });
    } else {
      return res.status(402).json({ message: 'Barcode is wrong' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getProductsBySearch = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    let paginate: any;
    // paginate = await ProductsFunctions.handlePagination(req.query)
    // const { startIndex, skip, pagination }: Pagination = paginate

    // @ts-ignore
    const products = await productModel
      .find({
        // @ts-ignore
        title: { $regex: search, $options: 'i' },
        isHidden: false
      })
      .limit(20);

    res.status(200).json({
      products
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getProductByBarCode = async (req: Request, res: Response) => {
  try {
    let { barCode }: any = req.query;

    let product: any = await productModel.findOne({ barCode, isHidden: false });
    if (!product) {
      return res.status(401).send('nothing found');
    }
    res.status(200).send(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getRelatedProducts = async (req: Request, res: Response) => {
  try {
    var { id } = req.params;
    var { categories } = req.body;
    var products = await productModel.find({ categories, isHidden: false });
    var result = [];

    for (let i = 0; i < products.length; i++) {
      if (products[i]._id.toString() != id.toString()) {
        result.push(products[i]);
      }
    }

    res.status(200).send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getProductsByCat = async (req: Request & { user: User }, res: Response) => {
  try {
    let removeFields: Array<string> = ['select', 'page', 'limit'];
    let queryStr: any = req.query;
    let selected: string | undefined = ' ';
    let paginate: any;
    const { id } = req.params;
    // queryStr = await ProductsFunctions.handlePrice(req.query);
    // selected = await ProductsFunctions.handleSelect(queryStr);
    paginate = await ProductsFunctions.handlePagination(true, id, queryStr);
    const { startIndex, skip, pagination }: Pagination = paginate;
    removeFields.forEach((params: string) => delete queryStr[params]);

    const products: any = await productModel
      .find({
        categories: id
      })
      // .populate('category')
      .select(selected)
      .skip(startIndex)
      .limit(skip);

    res.status(200).json({
      pagination,
      products
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getOneProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(401).json({ message: 'id is required' });
    }
    const product = await productModel.findOne({ _id: id });
    res.status(200).json({ product });
  } catch (error) {
    res.send(error.message);
  }
};

exports.deleteOneProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(401).json({ message: 'id is required' });
    }
    await productModel.findOneAndDelete({ _id: id });
    // const imagePath = `${__dirname}`;

    // try {
    //   product.images.forEach(async (img: any) => {
    //     await fs.unlinkSync(`${imagePath}/../upload/products/${img}`);
    //   });
    // } catch (error) {
    //   return res.status(200).json({ message: 'deleted without image' });
    // }

    res.status(200).json({ message: 'deleted' });
  } catch (error) {
    res.send(error.message);
  }
};

exports.updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(401).json({ message: 'id is required' });
    }
    const product = await productModel.findOneAndUpdate({ _id: id }, req.body);
    res.status(200).json({ product });
  } catch (error) {
    res.send(error.message);
  }
};

exports.replaceProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { ids } = req.body;
    const allIds = [id, ...ids];
    console.log(allIds);
    let saveProductsList: Array<string> = [];
    allIds.forEach(async item => {
      let products: any = await productModel.findById(item);
      saveProductsList.push(products);
    });
    console.log(saveProductsList);
    res.status(200).send(saveProductsList);
  } catch (error) {
    res.send(error.message);
  }
};

exports.getAllProducts = async (req: Request, res: Response) => {
  try {
    const paginate = await ProductsFunctions.handlePagination(false, 'null', req.query);
    const { startIndex, skip, pagination }: any = paginate;
    const { select } = req.query;

    const products = await productModel
      .find()
      .select(select)
      .skip(startIndex)
      .limit(skip);

    res.status(200).json({ pagination, products });
  } catch (error) {
    res.send(error.message);
  }
};

exports.getProductsHasADiscount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const thirdCat = await thirdCategoryModel.find({ subCategory: id });
    const thirdIds = await thirdCat.map(item => {
      return item._id;
    });

    const products = await productModel.find({ categories: { $in: thirdIds }, discount: { $gt: 0 }, isHidden: false });
    res.status(200).send(products);
  } catch (error) {
    res.send(error.message);
  }
};

exports.createXLSFile = async (req: Request & { user: User }, res: Response) => {
  try {
    const users = await productModel.find();

    var xls = json2xls(users, {
      fields: [
        'title',
        'details',
        'categories',
        'price',
        'discount',
        'discountEnds',
        'isVisible',
        'isHidden',
        'barCode',
        'increaseCount',
        'images',
        'variationId',
        'unit',
        'limit'
      ]
    });

    fs.writeFileSync(`${__dirname}/../upload/excelFilesForProducts/${Date.now().toString()}.xls`, xls, 'binary');

    res.status(200).send('Created!!');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getXLSFiles = async (req: Request & { user: User }, res: Response) => {
  try {
    var arrayOfImages: any[] = [];
    fs.readdir(`${__dirname}/../upload/excelFilesForProducts`, (err, list) => {
      if (err) {
        return res.status(401).json({ message: err });
      }
      for (let i = 0; i < list.length; i++) {
        arrayOfImages.push(list[i]);
      }
      return res.status(200).send(arrayOfImages);
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteFileXLS = async (req: Request & { user: User }, res: Response) => {
  try {
    const { name } = req.params;
    fs.unlinkSync(`${__dirname}/../upload/excelFilesForProducts/${name}`);
    return res.status(200).send('removed');
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
