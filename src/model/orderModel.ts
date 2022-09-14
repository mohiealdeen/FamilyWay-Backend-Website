import mongoose, { Schema, Document, model, Model } from 'mongoose';
import { orderStatus, orderConstants } from '../constant/constant';
import { Cart } from './cartMode';

var deepPopulate = require('mongoose-deep-populate')(mongoose);

export interface Order extends Document {
  user: string;
  status?: number;
  items?: Cart[];
  details: string;
  shippingAddress: string;
  arriveAt?: Date;
  points?: number;
  wallet?: number;
  delivery?: number;
  isCoupon?: boolean;
  coupon?: number;
  productsCost?: number;
  totalCost?: number;
  costBeforeDelivery?: number;
  freeDelivery?: boolean;
  expectedMoney?: string;
  id?: string;
  paymentMethod: number;
  rejectReason?: string;
  returnReason?: string;
  deliveredDate?: Date;
  isDriverRated?: boolean;
  isProductsRated?: boolean;
  driver?: string;
  driverRate?: string;
  driverDetails?: string;
  bill?: Array<string>;
  isArchived?: Boolean;
  time: {
    day: number;
    hour: number;
  };
}

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'Please Add a user'],
      ref: 'User'
    },
    status: {
      type: Schema.Types.Number,
      default: orderStatus.review
    },
    items: {
      type: Schema.Types.Array
    },
    details: { type: Schema.Types.String },
    shippingAddress: {
      type: Schema.Types.ObjectId,
      ref: 'Address',
      required: true
    },
    arriveAt: { type: Schema.Types.Date, default: new Date() },
    productsCost: Schema.Types.Number,
    totalCost: Schema.Types.Number,
    delivery: Schema.Types.Number,
    freeDelivery: {
      type: Schema.Types.Boolean,
      default: false
    },
    points: {
      type: Schema.Types.Number,
      default: 0
    },
    wallet: {
      type: Schema.Types.Number,
      default: 0
    },
    expectedMoney: Schema.Types.String,
    id: {
      type: Schema.Types.String,
      default: Math.floor(Math.random() * 99999999)
    },
    paymentMethod: {
      type: Schema.Types.Number,
      enum: [1, 2, 3, 4, 5],
      required: true
    },
    isCoupon: Schema.Types.Boolean,
    coupon: Schema.Types.Number,
    rejectReason: String,
    returnReason: String,
    driver: {
      type: Schema.Types.String
    },
    isDriverRated: {
      type: Schema.Types.Boolean,
      default: false
    },
    isArchived: {
      type: Schema.Types.Boolean,
      default: false
    },
    isProductsRated: {
      type: Schema.Types.Boolean,
      default: false
    },
    driverRate: {
      type: Schema.Types.Number,
      default: 0
    },
    productRate: {
      type: Schema.Types.Number,
      default: 0
    },
    driverDetails: Schema.Types.String,
    deliveredDate: Schema.Types.Date,
    bill: {
      type: Schema.Types.Array
    },
    time: {
      day: {
        type: Schema.Types.Number,
        required: true
      },
      hour: {
        type: Schema.Types.ObjectId,
        ref: 'OrderTimes',
        required: true
      }
    },
    costBeforeDelivery: Schema.Types.Number
  },
  {
    timestamps: true
  }
);

orderSchema.plugin(deepPopulate);

orderSchema.methods.handleOrder = async function (totalPrice: number, cartItems: Cart[], user: any, Constants: any) {
  try {
    // get the constants price for orders

    if (totalPrice < Constants?.order.midOrder) {
      // order from low to mid
      this.delivery = Constants.deliveryPrice.high;
    } else if (
      totalPrice > Constants?.order.midOrder && // order from mid to high
      totalPrice < Constants?.order.freeOrder
    ) {
      this.delivery = Constants.deliveryPrice.low; // order Hight and its free
    } else {
      this.delivery = 0;
    }
    this.costBeforeDelivery = totalPrice;
    this.totalCost = totalPrice + this.delivery;

    // // add cart to the order [items]
    // let cloneProducts = [];
    // for (let i = 0; i < cartItems.length; i++) {
    //   cloneProducts.push(cartItems[i].product);
    // }
    // this.items = cloneProducts;

    // check payment methods
    if (this.paymentMethod == 3) {
      if (this.totalCost < Constants.minimum.forWallet) {
        return 404;
      } else {
        if (user.wallet > this.totalCost) {
          user.wallet = user.wallet - this.totalCost;
        } else {
          user.wallet = 0;
        }
        await user.save();
      }
    }
    if (this.paymentMethod == 4) {
      const currencyVariation = await Constants.convertorMoney.pointsToMoney;
      if (user.points > Constants.minimum.forPoints) {
        let limit = this.points;
        user.points = user.points - limit;
        await user.save();
      } else {
        return 405;
      }
    }
    // save
    await this.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

const orderModel: Model<Order> = model('Order', orderSchema);
export default orderModel;
