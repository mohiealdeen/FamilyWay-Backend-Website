import { NextFunction, Request, Response } from 'express';
import productModel from '../model/productModel';
import { User } from '../model/userModel';
import cartModel from '../model/cartMode';

exports.add = async (req: Request & { user: User }, res: Response, next: NextFunction) => {
  try {
    const { product, increaseCount } = req.body;
    const { user } = req;

    if (!product && !increaseCount) {
      res.status(401).json({ message: 'Data is required' });
    }

    const findElement: any = await cartModel.findOne({ user: user._id, product }).populate('product');

    if (!findElement) {
      let cart: any = await cartModel.create({
        user: user._id,
        product,
        count: increaseCount
      });
      cart = await cart.populate('product').execPopulate();
      cart.calcPrice();

      res.status(200).json({ done: cart });
    } else {
      findElement.checkUserMax(increaseCount, res, next);
      res.status(200).json({ done: findElement });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.decrementAndDelete = async (req: Request & { user: User }, res: Response, next: NextFunction) => {
  try {
    const { product, decreaseCount, action } = req.body;
    const { user } = req;

    if (!product && !decreaseCount && !action) {
      res.status(404).json({ error: 'Important Data is Required' });
    }

    if (action == 'decrement') {
      const cart: any = await cartModel
        .findOne({
          user: user._id,
          product: product
        })
        .populate('product');

      cart.count -= decreaseCount;
      if (cart.count <= 0) {
        cart.deleteOne();
        res.status(200).json({ cart: 'deleted!!' });
      } else {
        cart.calcPrice();
        res.status(200).json({ cart });
      }
    }
    if (action == 'delete') {
      const cart: any = await cartModel.findOneAndDelete({
        user: user._id,
        product: product
      });
      res.status(200).json({ cart: 'deleted!!' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getCartItem = async (req: Request & { user: User }, res: Response) => {
  try {
    const { user } = req;
    const cartItems = await cartModel.find({ user: user._id }).populate('product');

    res.status(200).json({ cartItems });
  } catch (error) {
    res.send(error.message);
  }
};

exports.removeAll = async (req: Request & { user: User }, res: Response) => {
  try {
    const { user } = req;
    await cartModel.deleteMany({ user: user._id });
    res.status(200).send('removed');
  } catch (error) {
    res.send(error.message);
  }
};
