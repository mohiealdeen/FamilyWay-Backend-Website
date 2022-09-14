import { Request, Response, NextFunction } from 'express';
import { User } from '../model/userModel';
import thirdCategoryModel from '../model/thirdCategoryModel';
import fs from 'fs';
import productModel from '../model/productModel';

exports.createThirdCategory = async (req: Request & { user: User }, res: Response) => {
  try {
    const image = req.file;
    const FILE_MAX = 1000000;
    const { name, subCategory, forCards } = req.body;
    if (!image) {
      res.status(401).json({ message: 'image is required' });
    }

    if (!image.mimetype.startsWith('image')) {
      res.status(402).json({ message: 'This is not image' });
    }

    if (image.size > FILE_MAX) {
      res.status(403).json({ message: `you must be less than ${FILE_MAX / 1000000} MB` });
    }

    if (!name) {
      res.status(404).json({ message: `name is required` });
    }

    if (!subCategory) {
      res.status(404).json({ message: `parent _id is required` });
    }

    const thirdCategory = thirdCategoryModel.create({
      image: image.filename,
      subCategory,
      name,
      forCards
    });
    res.status(200).json({ message: 'third category is created!!!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllThirdCategory = async (req: Request & { user: User }, res: Response) => {
  try {
    let thirdCategory;
    thirdCategory = await thirdCategoryModel.find();
    res.status(200).json({ categories: thirdCategory });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getThirdCategoryId = async (req: Request & { user: User }, res: Response) => {
  try {
    let { id } = req.params;
    let subCategory;
    subCategory = await thirdCategoryModel.find({ subCategory: id });
    res.status(200).json({ categories: subCategory });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateThirdById = async (req: Request & { user: User }, res: Response) => {
  try {
    let { id } = req.params;
    await thirdCategoryModel.findByIdAndUpdate(id, req.body);
    res.status(200).send('updated');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCategory = async (req: Request & { user: User }, res: Response) => {
  try {
    let { id } = req.params;
    await thirdCategoryModel.findByIdAndDelete(id);
    // const imagePath = `${__dirname}`;
    // if (!thirdCategory == undefined || thirdCategory.length != 0) {
    //   thirdCategory.forEach(async (item: any) => {
    //     let products: any = await productModel.find({
    //       categories: [item._id]
    //     });
    //     if (!products == undefined || products.length != 0) {
    //       products.forEach((item: any) => {
    //         item.images.forEach((img: any) => {
    //           fs.unlinkSync(`${imagePath}/../upload/products/${img}`);
    //         });
    //       });
    //       await productModel.deleteMany({
    //         categories: [item._id]
    //       });
    //     }
    //     thirdCategory.forEach((item: any) => {
    //       fs.unlinkSync(`${imagePath}/../upload/thirdCategory/${item.image}`);
    //     });
    //     await thirdCategoryModel.deleteMany({
    //       subCategory: item._id
    //     });
    //   });
    // }

    // console.log(imagePath);
    // fs.unlinkSync(`${imagePath}/../upload/thirdCategory/${thirdCategory.image}`);
    res.status(200).json({ message: 'deleted!!!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
