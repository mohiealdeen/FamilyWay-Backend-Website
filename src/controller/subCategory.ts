import { Request, Response, NextFunction } from 'express';
import userModel, { User } from '../model/userModel';
import subCategoryModel, { SubCategory } from '../model/subCategoryModel';
import fs from 'fs';
import thirdCategoryModel from '../model/thirdCategoryModel';
import productModel from '../model/productModel';
import Jimp from 'jimp';
import parentCategoryModel, { Category } from '../model/parentCategoryModel';

exports.createSubCategory = async (req: Request & { user: User; files: any }, res: Response) => {
  try {
    var { name, parentCategory, wide, sort, forSmoking, bio } = req.body;

    if (!name) {
      res.status(404).json({ message: `name is required` });
    }

    if (!parentCategory) {
      res.status(404).json({ message: `parent _id is required` });
    }

    if (!wide) {
      res.status(404).json({ message: `wide is required` });
    }

    const subCategory = subCategoryModel.create({
      image: req.file.filename,
      parentCategory,
      name,
      wide,
      sort,
      forSmoking,
      bio
    });

    var categories: any = await parentCategoryModel.findById({ _id: parentCategory });
    var isWide = false;

    if (categories.isCompany) {
      isWide = true;
    }

    if (wide.toString() == 'false') {
      isWide = true;
    }

    // const uploadPath: string = __dirname + '/../upload/subCategories/' + req.file.filename;
    // try {
    //   const JIMP_QUALITY = 70;
    //   const img = await Jimp.read(uploadPath);
    //   img
    //     .resize(isWide ? Jimp.AUTO : 400, 190)
    //     .quality(JIMP_QUALITY)
    //     .write(__dirname + '/../upload/subCategories/' + req.file.filename);
    // } catch (error) {
    //   if (error) return res.json(error);
    // }
    res.status(200).json({ message: 'Category is created!!!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllSubCategory = async (req: Request & { user: User }, res: Response) => {
  try {
    let subCategory;
    subCategory = await subCategoryModel.find();
    res.status(200).json({ categories: subCategory });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllCompanies = async (req: Request & { user: User }, res: Response) => {
  try {
    let subCategory: any;
    let parentCategory: any;
    let array: any = [];
    parentCategory = await parentCategoryModel.find({ isCompany: true });

    parentCategory.forEach((item: any) => {
      array.push(item._id);
    });
    subCategory = await subCategoryModel.find({ parentCategory: { $in: array } });
    res.status(200).json({ categories: subCategory });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getSubCategoryId = async (req: Request & { user: User }, res: Response) => {
  try {
    let { id } = req.params;
    let subCategory;
    subCategory = await subCategoryModel.find({ parentCategory: id });
    res.status(200).json({ categories: subCategory });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getProductsInSub = async (req: Request, res: Response) => {
  try {
    let { id } = req.params;
    let third = await thirdCategoryModel.find({ subCategory: id });
    let thirdIds: any = [];
    let result: any = [];

    for (let i = 0; i < third.length; i++) {
      thirdIds.push(third[i]._id);
    }
    // @ts-ignore
    await productModel.findRandom(
      { categories: { $in: thirdIds } },
      {},
      { limit: 20 },
      // @ts-ignore
      function (err, results) {
        if (err) {
          return res.status(401).send(err);
        }
        if (!err) {
          return res.status(200).send(results);
        }
      }
    );
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateSubCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await subCategoryModel.findOneAndUpdate({ _id: id }, req.body);
    return res.status(200).send(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCategory = async (req: Request & { user: User }, res: Response) => {
  try {
    let { id } = req.params;
    await subCategoryModel.findByIdAndDelete(id);
    // const imagePath = `${__dirname}`;
    // if (!subCategory == undefined || subCategory.length != 0) {
    //   subCategory.forEach(async (item: any) => {
    //     let thirdCategory: any = await thirdCategoryModel.find({
    //       subCategory: item._id
    //     });
    //     if (!thirdCategory == undefined || thirdCategory.length != 0) {
    //       thirdCategory.forEach(async (item: any) => {
    //         let products: any = await productModel.find({
    //           categories: [item._id]
    //         });
    //         if (!products == undefined || products.length != 0) {
    //           products.forEach((item: any) => {
    //             item.images.forEach((img: any) => {
    //               fs.unlinkSync(`${imagePath}/../upload/products/${img}`);
    //             });
    //           });
    //           await productModel.deleteMany({
    //             categories: [item._id]
    //           });
    //         }
    //         thirdCategory.forEach((item: any) => {
    //           fs.unlinkSync(`${imagePath}/../upload/thirdCategory/${item.image}`);
    //         });
    //         await thirdCategoryModel.deleteMany({
    //           subCategory: item._id
    //         });
    //       });
    //     }
    //   });
    // }

    // console.log(imagePath);
    // fs.unlinkSync(`${imagePath}/../upload/subCategories/${subCategory.image}`);
    res.status(200).json({ message: 'deleted!!!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
