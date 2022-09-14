import { Request, Response, NextFunction } from 'express';
import cartModel, { Cart } from '../model/cartMode';
import couponModel, { Coupon, Discount } from '../model/couponModel';
import productModel, { Product } from '../model/productModel';
import thirdCategoryModel from '../model/thirdCategoryModel';
import { User } from '../model/userModel';

const isEmpty = (item: Array<any>): boolean => {
  let result = false;
  if (item === undefined || item.length == 0) {
    result = true;
  }
  return result;
};

const inArray = (array: Array<string>, id: string) => {
  var result: boolean = false;
  if (array.includes(id)) {
    result = true;
  }
  return result;
};

const handleDecimalNumber = (num: number): number => {
  let less: number | string = num.toFixed(2);
  less = parseFloat(less);
  return less;
};

const collectCartPrice = (array: any): number => {
  let priceResult = 0;
  for (let i = 0; i < array.length; i++) {
    priceResult += array[i].totalPrice;
  }
  return priceResult;
};

const removeElement = (array: Array<string>, elem: string): Array<string> => {
  var index = array.indexOf(elem);
  if (index > -1) {
    array.splice(index, 1);
  }
  return array;
};

const filterProducts = async (
  carts: Array<Cart>,
  productsInCoupon: Array<string>,
  coupon: Coupon,
  id: string
): Promise<number> => {
  let result: number;
  let array: Array<Cart> = [];
  let arrayWithoutCoupon: Array<Cart> = [];

  for (let i = 0; i < carts.length; i++) {
    if (productsInCoupon.includes(carts[i].product)) {
      console.log('with');
      array.push(carts[i]);
    } else {
      arrayWithoutCoupon.push(carts[i]);
      console.log('without');
    }
  }

  if (array.length == 0) {
    result = handleDecimalNumber(collectCartPrice(arrayWithoutCoupon));
    console.log(1, result);
  } else {
    result = handleDecimalNumber(
      collectCartPrice(array) - coupon.discount.saved! + collectCartPrice(arrayWithoutCoupon)
    );
    console.log(2, result);
  }
  console.log('result', result);
  coupon.end.usedCount! += 1;
  coupon.notExpected?.user!.push(id);
  await coupon.save();
  return result;
};

const filterCategories = async (carts: Array<Cart>, coupon: Coupon) => {
  const productsOfCategories = await productModel.find({
    categories: { $in: coupon.forWho.category }
  });
  let newCategories: Array<Product> = [];
  let arrayWithCoupon: Array<Cart> = [];
  let cartPrice = collectCartPrice(carts) || 0;

  for (let i = 0; i < productsOfCategories.length; i++) {
    if (!coupon.notExpected?.product?.includes(productsOfCategories[i]._id) && productsOfCategories[i].discount == 0) {
      newCategories.push(productsOfCategories[i]._id);
    }
  }

  for (let j = 0; j < newCategories.length; j++) {
    for (let i = 0; i < carts.length; i++) {
      if (newCategories[j].toString() == carts[i].product.toString()) {
        arrayWithCoupon.push(carts[i]);
      }
    }
  }

  // @ts-ignore
  var resultOfCoupon: number = collectCartPrice(arrayWithCoupon);
  return { resultOfCoupon, cartPrice };
};

const usedIncrement = async (coupon: Coupon) => {
  coupon.end.usedCount! += 1;
  await coupon.save();
};

const filterOrder = async (coupon: Coupon, userId: string, res: Response): Promise<number> => {
  const carts: Array<Cart> = await cartModel.find({ user: userId }).populate('product');
  let result: number;

  if (coupon.discount.isPercent) {
    result = collectCartPrice(carts) * (1 - coupon.discount.saved! / 100);
    result = handleDecimalNumber(result);
  } else {
    result = collectCartPrice(carts) - coupon.discount.saved!;
  }
  await outThisUser('user', userId, coupon, res);
  await coupon.save();
  return result;
};

const lengthOfUser = (array: Array<string>, id: string) => {
  var count: number = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i].toString() == id.toString()) {
      count++;
    }
  }
  return count;
};

// const whatIsCouponFor = async (
//   priceResult: any,
//   carts: Array<Cart>,
//   coupon: Coupon,
//   req: Request,
//   res: Response,
//   user: User,
//   next: NextFunction
// ) => {

// }

const calcCoupon = async (coupon: Coupon, user: User, res: Response, priceResult: number | undefined) => {
  if (coupon.discount.isPercent) {
    let pricePercent: number = priceResult! * (coupon.discount.saved! / 100);
    pricePercent = await handleDecimalNumber(pricePercent);
    coupon.end.usedCount! += 1;
    await outThisUser('user', user._id, coupon, res);
    await coupon.save();
    return priceResult! - pricePercent;
  } else {
    if (coupon.discount.forWallet! > 0) {
      user.wallet! += coupon.discount.forWallet!;
      coupon.end.usedCount! += 1;
      await outThisUser('user', user._id, coupon, res);
      await coupon.save();
      await user.save();
      return res.status(201).send(`تم اضافة هذا المبلغ ${coupon.discount.forWallet!} الي المحفظه`);
    }
    if (coupon.discount.forPoints! > 0) {
      user.points! += coupon.discount.forPoints!;
      coupon.end.usedCount! += 1;
      await outThisUser('user', user._id, coupon, res);
      await coupon.save();
      await user.save();
      return res.status(202).send(`تم اضافة هذه النقاط ${coupon.discount.forWallet!} الي المحفظه`);
    }
    if (coupon.discount.saved! > 0) {
      priceResult! -= coupon.discount.saved!;
      coupon.end.usedCount! += 1;
      await outThisUser('user', user._id, coupon, res);
      await coupon.save();
      return priceResult;
    }
  }
};

const outThisUser = async (string: string, id: string, coupon: Coupon, res: Response) => {
  try {
    console.log(1);
    if (string == 'user') {
      console.log(2);
      if (lengthOfUser(coupon.notExpected?.user!, id) >= coupon.end.userCount!) {
        console.log(3);
        removeElement(coupon?.forWho.user!, id);
      } else {
        console.log(coupon);
        coupon.notExpected?.user!.push(id);
      }
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.createCoupon = async (req: Request, res: Response) => {
  try {
    const { code, forWho, notExpected, minimum, discount, end, message } = req.body;

    // if (forWho.product) {
    //   const product: any = await productModel.findOne({ _id: forWho.product })
    //   if (product.discount > 0) {
    //     res.status(401).json({ message: 'This product have a discount' })
    //   }
    // }

    if (end.dateLimit) {
      const now = Date.now();
      if (now > end.dateLimit) {
        res.status(402).json({ message: 'this date is gone' });
      }
    }

    const coupons = await couponModel.find();
    for (let i = 0; i < coupons.length; i++) {
      if (coupons[i].code === code) {
        return res.status(403).send('Duplicated Codes');
      }
    }

    const coupon = await couponModel.create({
      code,
      forWho,
      discount,
      minimum,
      notExpected,
      end,
      message
    });
    res.status(200).json({ message: 'Created!!', coupon });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllCoupons = async (req: Request, res: Response) => {
  try {
    const coupons = await couponModel.find();
    res.status(200).json({ coupons });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.connectCoupon = async (req: Request & { user: User }, res: Response, next: NextFunction) => {
  try {
    let { code } = req.body;
    let user = req.user;
    let coupons = await couponModel.find({ code });
    let coupon = coupons[0];
    let isDelivery = false;
    let carts: any = await cartModel.find({ user: user._id });
    let priceResult: any = collectCartPrice(carts);
    priceResult = handleDecimalNumber(priceResult);

    if (isEmpty(coupons)) {
      return res.status(401).send('this coupon is empty');
    }

    if (isEmpty(carts)) {
      return res.status(402).send("You haven't any product in cart page");
    }

    // Check minimum
    if (priceResult! < coupon.minimum) {
      return res.status(403).send('Your cart is not enough');
    }
    // Check Date
    let now: Date = new Date();
    if (now > coupon.end.dateLimit) {
      return res.status(404).send('Your coupon is end');
    }
    // Check Limit users
    if (coupon?.end.usedCount! >= coupon?.end.limit!) {
      return res.status(405).send('This coupon is end by user limits');
    }
    // Check NotExpected
    if (!isEmpty(coupon.notExpected?.user!)) {
      if (lengthOfUser(coupon.notExpected?.user!, user._id) >= coupon.end.userCount!) {
        return res.status(408).send('you cant use this coupon');
      }
    }

    // Check in user list ot not
    if (!isEmpty(coupon?.forWho.user!)) {
      if (inArray(coupon?.forWho.user!, user._id)) {
        priceResult = await calcCoupon(coupon, user, res, priceResult);
      }
    }

    if (!isEmpty(coupon?.forWho.product!)) {
      priceResult = await filterProducts(carts, coupon?.forWho.product!, coupon, user._id);
    }

    if (!isEmpty(coupon?.forWho.category!)) {
      const { resultOfCoupon, cartPrice } = await filterCategories(carts, coupon);
      if (resultOfCoupon < coupon.minimum) {
        return res.status(403).send('Your cart is not enough');
      } else {
        // @ts-ignore
        if (coupon.discount.isPercent) {
          let percentPrice = resultOfCoupon * (1 - coupon.discount.saved! / 100) - resultOfCoupon;
          priceResult = cartPrice + percentPrice;
        } else {
          // @ts-ignore
          priceResult = cartPrice - coupon.discount.saved;
        }
      }
    }

    if (coupon.forWho.order) {
      priceResult = await filterOrder(coupon, user._id, res);
      await usedIncrement(coupon);
    }

    if (coupon?.forWho.delivery) {
      isDelivery = true;
      await usedIncrement(coupon);
      await outThisUser('user', user._id, coupon, res);
    }

    return res.status(200).send(isDelivery ? { delivery: true } : { priceResult });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCoupons = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await couponModel.findByIdAndDelete(id);
    res.status(200).send('Deleted!!!');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
