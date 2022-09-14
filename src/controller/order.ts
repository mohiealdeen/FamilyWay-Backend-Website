import { Request, Response, NextFunction } from 'express';
import userModel, { User } from '../model/userModel';
import cartModel from '../model/cartMode';
import orderModel, { Order } from '../model/orderModel';
import constantsModel from '../model/constantsModel';
import mongoose from 'mongoose';
import orderTimesModel, { OrderTimes } from '../model/orderTimes';
import { paginateIt } from '../constant/constant';
import PushController from '../Config/PushController';
import ProductsFunctions from '../Config/productsFunctions';

exports.createOrder = async (req: Request & { user: User }, res: Response) => {
  try {
    const { user } = req;
    const {
      details,
      shippingAddress,
      paymentMethod,
      expectedMoney,
      isCoupon,
      coupon,
      time,
      points,
      wallet,
      delivery,
      totalCost,
      productsCost,
      items,
      freeDelivery
    } = req.body;

    const cartItems: any = await cartModel.find({ user: user._id }).populate('product');

    const Constants: any = await constantsModel.findOne().sort('-created_at');
    const { minimum } = Constants.order;
    // calculating total price
    const orderTotalPrice = await cartItems.reduce((accumulator: number, current: { totalPrice: number }) => {
      return accumulator + current.totalPrice;
    }, 0);

    if (orderTotalPrice <= minimum) {
      res.status(401).json({ message: `order is less than ${minimum}` });
      return;
    }

    if (!shippingAddress) {
      res.status(402).json({ message: `Address Is Required` });
      return;
    }
    if (!paymentMethod) {
      res.status(403).json({ message: `paymentMethod Is Required` });
      return;
    }
    if (!time) {
      res.status(406).json({ message: `time is required` });
      return;
    }

    let cloneProducts = [];
    for (let i = 0; i < cartItems.length; i++) {
      cloneProducts.push(cartItems[i].product._id);
    }

    const order: any = await orderModel.create({
      user: user._id,
      details,
      shippingAddress,
      paymentMethod,
      expectedMoney,
      points,
      wallet,
      delivery,
      totalCost,
      productsCost,
      isCoupon,
      coupon,
      time,
      freeDelivery,
      items
    });

    if (time.hour) {
      let allTimes: any = await orderTimesModel.findById(time.hour);
      if (allTimes.isDisabled) {
        // @ts-ignore
        allTimes?.currentCount += 1;
        await allTimes.save();
      } else {
        await orderModel.findByIdAndDelete(order._id);
        return res.status(407).json({ message: 'This time is busy' });
      }
    } else {
      return res.status(409).json({ message: 'no time !!' });
    }

    const StatusCode = await order.handleOrder(orderTotalPrice, cartItems, user, Constants);

    if (StatusCode != undefined || StatusCode != null) {
      switch (StatusCode) {
        case 404: {
          await orderModel.findByIdAndDelete(order._id);
          return res.status(404).json({ message: "You don't have enough money on your wallet" });
        }
        case 405: {
          await orderModel.findByIdAndDelete(order._id);
          return res.status(405).json({ message: "You don't have enough points" });
        }
      }
    }

    const userOrder: any = await userModel.findOne({ _id: user._id });

    userOrder?.orders?.push(order._id);

    await cartModel.deleteMany({ user: user._id });
    await userOrder.save();

    const data = {
      navigator: 'OneOrder',
      data: 'order._id',
      bigText: 'تهنئه ❤️ ✅ ',
      subText: 'تطبيق فاميلي واي',
      title: 'لقد تم طلب الأوردر بنجاح , دقائق وسنقوم بتجهيزه وأرساله لك في الحال ✅ '
    };

    PushController(user.TOKEN_FCM, data);

    res.send({ message: 'created', order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getOrders = async (req: Request & { user: User }, res: Response) => {
  try {
    const { user } = req;
    //
    const orders = await orderModel.find({ user: user._id }).sort({ createdAt: -1 });
    // // @ts-ignore
    // .deepPopulate('items.product')
    res.send({ message: 'created', orders, count: orders.length });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getOrdersById = async (req: Request & { user: User }, res: Response) => {
  try {
    const { user } = req;
    const { id } = req.params;
    // @ts-ignore
    const order = await orderModel
      .find({ _id: id })
      .populate('shippingAddress')
      .populate('time.hour');
    // @ts-ignore
    res.send({ message: 'created', order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateOrder = async (req: Request & { user: User }, res: Response) => {
  try {
    const images: any = req.files;
    const { user, body } = req;
    const { id }: any = req.params;
    let filterImages: Array<string> = [];
    const order: any = await orderModel.findOneAndUpdate({ _id: id }, req.body);

    if (body.isDriverRated && body.isProductsRated) {
      let thisOrder: any = await orderModel.findOne({ _id: id });
      const driver = await userModel.findOne({ role: 'DRIVER', _id: thisOrder.driver });

      driver?.deliveryRate?.push({
        // @ts-ignore
        orderReview: id,
        orderRate: body.driverRate
      });
      // @ts-ignore
      await driver.save();
      // @ts-ignore
      PushController(driver.TOKEN_FCM, {
        navigator: 'OneOrder',
        data: 'order._1',
        bigText: 'لقد تم تقييمك ❤️ ✅ ',
        subText: 'تطبيق فاميلي واي',
        title: `لقد قام العميل بتقييمك : ${body.driverRate} ${body.driverRate >= 5 ? '✅' : '⛔️'}  `
      });

      const data = {
        navigator: 'OneOrder',
        data: 'order._1',
        bigText: 'نشكرك ❤️ ✅ ',
        subText: 'تطبيق فاميلي واي',
        title: 'شكراً علي تقييمك طلبنا ✅ '
      };
      PushController(user.TOKEN_FCM, data);
    }
    if (body.status) {
      const user: any = await userModel.findOne({ _id: order.user });
      if (body.status == 1) {
        const data = {
          navigator: 'OneOrder',
          data: 'order._1',
          bigText: 'تهنئه ❤️ ✅ ',
          subText: 'تطبيق فاميلي واي',
          title: 'لقد قمنا بأستقبال طلبك والأن سنقوم بتجهيزه حالا ✅ '
        };

        PushController(user.TOKEN_FCM, data);
      }
      if (body.status == 2) {
        const orderTimes: any = await orderTimesModel.findOne(order.time.hour);
        orderTimes.currentCount -= 1;
        if (!orderTimes.isDisabled) {
          orderTimes.isDisabled = true;
        }
        const data = {
          navigator: 'OneOrder',
          data: 'order._2',
          bigText: 'تهنئه ❤️ ✅ ',
          subText: 'تطبيق فاميلي واي',
          title: 'لقد قمنا بتجهيز طلبك الأن سنقوم بأرساله لك ✅ '
        };

        PushController(user.TOKEN_FCM, data);
        await orderTimes.save();
      }
      if (body.status == 3) {
        let thisOrder: any = await orderModel.findOne({ _id: id }).populate('user');
        const driver: any = await userModel.findOne({ role: 'DRIVER', _id: thisOrder.driver });
        PushController(driver.TOKEN_FCM, {
          navigator: 'OneOrder',
          data: 'order._1',
          bigText: 'لقد تم تعيينك ❤️ ✅ ',
          subText: 'تطبيق فاميلي واي',
          title: `الأن ستقوم بتوصيل طلب الي الأستاذ ${thisOrder.user.name} ❤️ ✅`
        });

        const data = {
          navigator: 'OneOrder',
          data: 'order._id',
          bigText: 'الأن طلبك فيه طريقه لك ❤️ ✅ ',
          subText: 'تطبيق فاميلي واي',
          title: 'لقد قمنا بأرسال طلبك . والموصل في الطريق الأن ✅ '
        };
        PushController(user.TOKEN_FCM, data);
      }
      if (body.status == 4) {
        await orderModel.findOneAndUpdate({ _id: id }, { deliveredDate: new Date() });
        const data = {
          navigator: 'OneOrder',
          data: 'order._id',
          bigText: 'تم الأستلام ❤️ ✅ ',
          subText: 'تطبيق فاميلي واي',
          title: 'تم وصول طلبك بنجاح , نتمني ان ينال اعجابكم ✅ '
        };
        PushController(user.TOKEN_FCM, data);
      }
      if (body.status == 5) {
        const data = {
          navigator: 'OneOrder',
          data: 'order._id',
          bigText: 'طلب استرجاع ✅ ',
          subText: 'تطبيق فاميلي واي',
          title: 'لقد قمنا قمنا بأستقبال طلب الأسترجاع سوف نتواصل معكم ✅ '
        };
        PushController(user.TOKEN_FCM, data);
      }
      if (body.status == 6) {
        const data = {
          navigator: 'OneOrder',
          data: 'order._id',
          bigText: 'طلب استرجاع ✅ ',
          subText: 'تطبيق فاميلي واي',
          title: 'لقد قمنا سقبول طلب الأسترجاع الأن سنرسل لك موصل ليأخذه ✅ '
        };
        PushController(user.TOKEN_FCM, data);
      }
      if (body.status == 7) {
        const data = {
          navigator: 'OneOrder',
          data: 'order._id',
          bigText: 'طلب استرجاع ❗️ ',
          subText: 'تطبيق فاميلي واي',
          title: 'لقد تم رفض طلب الأسترجاع الخاص بكم ⛔️ '
        };
        PushController(user.TOKEN_FCM, data);
      }
      if (body.status == 8) {
        const data = {
          navigator: 'OneOrder',
          data: 'order._id',
          bigText: 'رفض الطلب ❗️ ',
          subText: 'تطبيق فاميلي واي',
          title: 'لقد تم رفض طلبكم يمكنك المحاوله مره اخري ⛔️ '
        };
        PushController(user.TOKEN_FCM, data);
      }
    }

    if (images === undefined || images.length === 0) {
    } else {
      images.forEach((img: any) => {
        filterImages.push(img.filename);
      });
      // @ts-ignore
      order?.bill = filterImages;
    }

    await order.save();
    res.send({ message: 'Updated' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.applyDriver = async (req: Request & { user: User }, res: Response) => {
  try {
    const { orderId } = req.params;
    const { driverName } = req.body;

    if (!driverName) {
      return res.status(401).send('Please add driver name');
    }

    const order: any = await orderModel.findOne({ _id: orderId }).populate('user');
    order.driver = driverName;
    await order.save();
    const data = {
      navigator: 'OneOrder',
      data: 'order._id',
      bigText: 'الموصل',
      subText: 'تطبيق فاميلي واي',
      title: `الموصل في طريقه الليك . اسم الموصل :  ✅ ${driverName}`
    };
    console.log(order.user.TOKEN_FCM);
    PushController(order.user.TOKEN_FCM, data);
    return res.status(200).send('Sent!!');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.removeOrder = async (req: Request & { user: User }, res: Response) => {
  try {
    const { id } = req.params;
    const { user } = req;

    let orders: any = await orderModel.findById(id);

    let removeOrderUser: any = await userModel.findOne({ _id: user._id });

    const newOrders = removeOrderUser?.orders?.filter((item: any) => {
      return item == orders._id;
    });

    if (orders.status < 2) {
      const orderTimes: any = await orderTimesModel.findOne(orders.time.hour);
      orderTimes.currentCount -= 1;
      if (!orderTimes.isDisabled) {
        orderTimes.isDisabled = true;
      }
      orderTimes.save();
    }
    removeOrderUser.orders = newOrders;
    await removeOrderUser.save();
    await orders?.remove();

    res.send({ message: 'Deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getOrdersInDays = async (req: Request & { user: User }, res: Response) => {
  try {
    const { history, page, limit }: any = req.query;
    var day: any = new Date();

    if (!history) {
      return res.status(401).send({ error: 'Please add History Date' });
    }

    const orders: any = await orderModel.find({
      createdAt: {
        $gte: new Date(day - history * 60 * 60 * 24 * 1000)
      }
    });

    res.status(200).send({
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getOrdersForAdmin = async (req: Request & { user: User }, res: Response) => {
  try {
    let queryStr: any = req.query;
    let paginate: any;
    let removeFields: Array<string> = ['page', 'limit', 'isArchived'];
    let isArchived: Boolean = req.query.isArchived == 'true' ?? false;

    paginate = await ProductsFunctions.handleOrderPagination(queryStr);
    removeFields.forEach((params: string) => delete queryStr[params]);
    const { startIndex, skip, pagination }: any = paginate;

    const orders: any = await orderModel
      .find({ isArchived })
      .skip(startIndex)
      .limit(skip)
      .sort({ createdAt: -1 })
      .populate('user')
      .populate('shippingAddress');

    res.status(200).send({
      pagination,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
