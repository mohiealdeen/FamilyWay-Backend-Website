import { Document, Schema, Model, model } from 'mongoose';
import { Field } from 'multer';

export interface Category extends Document {
  name: string;
  image?: string;
  sort?: number;
  createdAt?: Date;
  updatedAt?: Date;
  isCompany: boolean;
}

const parentCategorySchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true
    },
    image: {
      type: Schema.Types.String,
    },
    sort: {
      type: Schema.Types.Number,
      default: 1
    },
    isCompany: {
      type: Schema.Types.Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const parentCategoryModel: Model<Category> = model<Category>('parentCategory', parentCategorySchema);

export default parentCategoryModel;
