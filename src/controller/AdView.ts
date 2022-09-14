import { NextFunction, Request, Response } from 'express';
import adViewModel from '../model/adView';
const fs = require('fs').promises;

exports.addAdView = async (req: Request, res: Response) => {
  try {
    const { isTimer, time } = req.body;
    const image = req.file;
    const adView = await adViewModel.find();
    if (adView.length === 0 || adView === undefined) {
      await adViewModel.create({
        image: image.filename
      });
      return res.status(200).send('created');
    } else {
      await adViewModel.updateMany({}, { image: image.filename });
      return res.status(200).send('Updated');
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

exports.getAdd = async (req: Request, res: Response) => {
  try {
    const adView = await adViewModel.find();
    res.status(200).send(adView);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

exports.deleteAd = async (req: Request, res: Response) => {
  try {
    await adViewModel.deleteMany({});
    console.log()
    res.status(200).send('deleted');
  } catch (error) {
    return res.status(400).send(error.message);
  }
};
