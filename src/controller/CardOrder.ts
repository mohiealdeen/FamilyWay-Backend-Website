import { NextFunction, Request, Response } from 'express';
import cardOrderModel from '../model/CardOrder';

exports.createCardOrder = async (req: Request, res: Response) => {
  try {
    const image = req.file;
    const { phone, product } = req.body;
    console.log(req.body.data._parts)
    console.log(req.file)
    if (!image) {
      return res.status(401).send('image error');
    }
    if (!phone || !product) {
      return res.status(402).send('body error');
    }

    await cardOrderModel.create({
      image: image.filename,
      phone,
      product
    });
    return res.status(200).send('Ordered');
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

exports.getAllOrder = async (req: Request, res: Response) => {
  try {
    const orders = await cardOrderModel.find().populate('product');
    res.status(200).send(orders);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

exports.OrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const orders = await cardOrderModel.findOne({ _id: id }).populate('product');
    res.status(200).send(orders);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};
