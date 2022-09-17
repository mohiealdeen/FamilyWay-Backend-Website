import { Schema, Document, model, Model } from 'mongoose';
import { generateCoupons } from '../constant/constant';

export interface Coupon extends Document {
  code: string;
  forWho: ForWho;
  notExpected: NotExpected;
  minimum: number;
  discount: Discount;
  end: End;
  message: string;
}

export interface Discount {
  isPercent?: boolean;
  saved?: number;
  forWallet?: number;
  forPoints?: number;
}

export interface ForWho {
  user?: Array<string>;
  product?: Array<string>;
  category?: Array<string>;
  delivery?: boolean;
  order?: boolean;
}

export interface End {
  userCount?: number;
  usedCount?: number;
  limit?: number; // This above finished by date
  dateLimit?: any;
}

export interface NotExpected {
  user?: Array<string>;
  product?: Array<string>;
  category?: Array<string>;
}

const couponSchema = new Schema({
  code: {
    type: Schema.Types.String,
    unique: true
  },
  forWho: {
    user: [Schema.Types.ObjectId],
    product: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product'
      }
    ],
    category: [
      {
        type: Schema.Types.ObjectId,
        ref: 'thirdCategory'
      }
    ],
    delivery: {
      type: Schema.Types.Boolean,
      default: false
    },
    order: {
      type: Schema.Types.Boolean,
      default: false
    }
  },
  notExpected: {
    user: [Schema.Types.ObjectId],
    product: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product'
      }
    ],
    category: [
      {
        type: Schema.Types.ObjectId,
        ref: 'thirdCategory'
      }
    ]
  },
  minimum: {
    type: Schema.Types.Number,
    required: true
  },
  discount: {
    isPercent: {
      type: Schema.Types.Boolean,
      default: false
    },
    saved: {
      type: Schema.Types.Number,
      default: 0
    },
    forWallet: {
      type: Schema.Types.Number,
      default: 0
    },
    forPoints: {
      type: Schema.Types.Number,
      default: 0
    }
  },
  end: {
    userCount: {
      type: Schema.Types.Number,
      default: 1
    },
    usedCount: {
      type: Schema.Types.Number,
      default: 0
    },
    limit: {
      type: Schema.Types.Number,
      default: 100
    },
    dateLimit: Schema.Types.Date
  },
  message: {
    type: String,
    required: true
  }
});

const couponModel: Model<Coupon> = model<Coupon>('Coupon', couponSchema);

export default couponModel;
