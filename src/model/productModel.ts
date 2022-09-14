import { Schema, Document, Model, model } from 'mongoose';
import cartModel, { Cart } from './cartMode';
import { ThirdCategory } from './thirdCategoryModel';
import { User } from './userModel';
// @ts-ignore
import random from 'mongoose-simple-random';

export interface Product extends Document {
  title: string;
  details: string;
  categories: any;
  price: number;
  discount: number;
  discountEnds: any;
  isVisible?: boolean;
  isHidden?: boolean;
  barCode?: string;
  increaseCount: number;
  images: Array<string>;
  userMax: number;
  inStock: number;
  variationId: string;
  sold?: number;
  inCart?: boolean;
  replace?: Array<string>;
  unit: string;
  boxUnit: string;
  checkInCart?: any;
  limit?: number;
  // isCard?: boolean;
}

const productSchema = new Schema(
  {
    title: {
      type: Schema.Types.String,
      required: true
    },
    details: {
      type: Schema.Types.String,
      required: true
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'thirdCategory'
      }
    ],
    price: {
      type: Schema.Types.Number,
      required: true
    },
    discount: {
      type: Schema.Types.Number,
      default: 0
    },
    inCart: {
      type: Schema.Types.Boolean,
      default: false
    },
    discountEnds: {
      type: Schema.Types.Date
    },
    barCode: {
      type: Schema.Types.String,
      unique: true
    },
    increaseCount: {
      type: Schema.Types.Number,
      default: 1
    },
    isVisible: {
      type: Schema.Types.Boolean,
      default: true
    },
    isHidden: {
      type: Schema.Types.Boolean,
      default: false
    },
    // isCard: {
    //   type: Schema.Types.Boolean,
    //   default: false
    // },
    limit: {
      type: Schema.Types.Number,
      default: 100
    },
    variationId: Schema.Types.String,
    images: [
      {
        type: Schema.Types.String
      }
    ],
    sold: {
      type: Schema.Types.Number,
      default: 0
    },
    replace: {
      type: Schema.Types.String,
      ref: 'Product'
    },
    userMax: {
      type: Schema.Types.Number,
      default: 1000
    },
    inStock: {
      type: Schema.Types.Number,
      default: 1000
    },
    unit: {
      type: Schema.Types.String,
      enum: ['1', '2', '3', '4'],
      required: true
    },
    boxUnit: {
      type: Schema.Types.String
    }
  },
  { timestamps: true }
);

productSchema.plugin(random);

productSchema.post('init', async function () {
  // @ts-ignore
  const doc: Product = this;
  const now: Date = new Date();

  if (now > doc.discountEnds) {
    doc.discountEnds = undefined;
    doc.discount = 0;
    await doc.save();
  }
});

const productModel: Model<Product> = model('Product', productSchema);

export default productModel;
