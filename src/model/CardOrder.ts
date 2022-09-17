import { Document, Model, model, Schema } from 'mongoose';

export interface CardOrder extends Document {
  image: any;
  phone: number;
  product: any
}

const cardOrderSchema = new Schema(
  {
    image: {
      type: Schema.Types.String,
      required: true
    },
    phone: {
      type: Schema.Types.Number,
      required: true
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    }
  },
  { timestamps: true }
);

const cardOrderModel: Model<CardOrder> = model<CardOrder>('CardOrder', cardOrderSchema);
export default cardOrderModel;
