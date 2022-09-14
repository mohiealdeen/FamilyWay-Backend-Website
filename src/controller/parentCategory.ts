import { Request, Response, NextFunction } from 'express';
import userModel, { User } from '../model/userModel';
import parentCategoryModel from '../model/parentCategoryModel';
import fs from 'fs';
import subCategoryModel from '../model/subCategoryModel';
import thirdCategoryModel from '../model/thirdCategoryModel';
import productModel from '../model/productModel';

exports.createCategory = async (req: Request & { user: User }, res: Response) => {
  try {
    // const image: any = req.file
    const { name, isCompany, sort } = req.body;
    const category = await parentCategoryModel.create({
      // image: image.filename,
      name,
      sort,
      isCompany
    });
    res.status(200).json({ message: 'parent Category is Created!!!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getParentCategory = async (req: Request & { user: User }, res: Response) => {
  try {
    let { id } = req.params;
    let category;

    if (!id) {
      res.status(400).json({ error: '_id is required' });
    }

    category = await parentCategoryModel.find({ _id: id });
    res.status(200).json({ category });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.allCategories = async (req: Request & { user: User }, res: Response) => {
  try {
    let category;
    category = await parentCategoryModel.find();
    res.status(200).json({ categories: category });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCategory = async (req: Request & { user: User }, res: Response) => {
  try {
    let { id } = req.params;
    await parentCategoryModel.findByIdAndDelete(id);
    // let subCategories: any = await subCategoryModel.find({
    //   parentCategory: id
    // });

    // try {
    //   if (!subCategories == undefined || subCategories.length != 0) {
    //     subCategories.forEach(async (item: any) => {
    //       let thirdCategory: any = await thirdCategoryModel.find({
    //         subCategory: item._id
    //       });
    //       if (!thirdCategory == undefined || thirdCategory.length != 0) {
    //         thirdCategory.forEach(async (item: any) => {
    //           let products: any = await productModel.find({
    //             categories: [item._id]
    //           });
    //           if (!products == undefined || products.length != 0) {
    //             products.forEach((item: any) => {
    //               item.images.forEach((img: any) => {
    //                 fs.unlinkSync(`${imagePath}/../upload/products/${img}`);
    //               });
    //             });
    //             await productModel.deleteMany({
    //               categories: [item._id]
    //             });
    //           }
    //           thirdCategory.forEach((item: any) => {
    //             fs.unlinkSync(`${imagePath}/../upload/thirdCategory/${item.image}`);
    //           });
    //           await thirdCategoryModel.deleteMany({
    //             subCategory: item._id
    //           });
    //         });
    //       }
    //     });
    //   }
    //   const imagePath = `${__dirname}`;

    //   subCategories.forEach((item: any) => {
    //     fs.unlinkSync(`${imagePath}/../upload/subCategories/${item.image}`);
    //   });
    //   // fs.unlinkSync(
    //   //   `${imagePath}/../upload/parentCategories/${parentCategory.image}`
    //   // )
    //   await subCategoryModel.deleteMany({
    //     parentCategory: id
    //   });
    // } catch (error) {
    //   return res.status(200).json({ message: 'deleted without image' });
    // }

    res.status(200).json({ message: 'deleted!!!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateCategory = async (req: Request & { user: User }, res: Response) => {
  try {
    const { id } = req.params;
    await parentCategoryModel.findByIdAndUpdate(id, req.body);
    res.status(200).json({ message: 'updated' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
