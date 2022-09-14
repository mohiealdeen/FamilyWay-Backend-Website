import { Request, Response, NextFunction } from 'express';
import constantsModel from '../model/constantsModel';

exports.createConstant = async (req: Request, res: Response) => {
  try {
    const constants = await constantsModel.find();
    if (constants.length === 0 || constants === undefined) {
      await constantsModel.create(req.body);
      return res.status(200).send('created');
    } else {
      await constantsModel.updateMany({}, req.body);
      return res.status(200).send('Updated');
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getConstants = async (req: Request, res: Response) => {
  try {
    const constants = await constantsModel.findOne().sort('-created_at');
    res.status(200).send(constants);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};