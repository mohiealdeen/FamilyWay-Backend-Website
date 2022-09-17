import { Request, Response, NextFunction } from 'express';
import parentCategoryModel, { Category } from '../model/parentCategoryModel';
import subCategoryModel from '../model/subCategoryModel';
import thirdCategoryModel from '../model/thirdCategoryModel';

exports.getAllCompanies = async (req: Request, res: Response) => {
  try {
    let { limit }: any = req.query;
    limit = parseInt(limit, 10);
    let categories = await parentCategoryModel.find({ isCompany: true });
    let collectIds = categories.map((item: any) => item._id);

    let collectAllSub = await subCategoryModel.find({ parentCategory: { $in: collectIds } });
    let collectSubIds = collectAllSub.map((item: any) => item._id);

    let collectAllThird = await thirdCategoryModel.find({ subCategory: { $in: collectSubIds } }).limit(limit);

    res.send(collectAllThird);
  } catch (error) {
    // res.status(400).json({ error: error.message });
    res.status(400).json({ error: error });
  }
};