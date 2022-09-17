import { Document, Schema, Model, model } from 'mongoose';

export interface ThirdCategory extends Document {
  name: string;
  image: string;
  subCategory: string;
  forCards?: Boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const thirdCategorySchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true
    },
    image: {
      type: Schema.Types.String,
      required: true
    },
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: 'subCategory',
      required: true
    },
    forCards: {
      type: Schema.Types.Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const thirdCategoryModel: Model<ThirdCategory> = model<ThirdCategory>('thirdCategory', thirdCategorySchema);

export default thirdCategoryModel;
