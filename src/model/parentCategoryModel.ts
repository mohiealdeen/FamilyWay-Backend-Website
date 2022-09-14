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

const parentCategoryModel: Model<Category> = model('parentCategory', parentCategorySchema);

export default parentCategoryModel;
