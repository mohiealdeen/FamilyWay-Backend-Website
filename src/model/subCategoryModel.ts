import { Document, Schema, Model, model } from 'mongoose';

export interface SubCategory extends Document {
  name: string;
  image: string;
  parentCategory: string;
  createdAt?: Date;
  updatedAt?: Date;
  sort?: number;
  wide: boolean;
  isHidden?: boolean;
  forSmoking?: boolean;
  bio:string
}

const subCategorySchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true
    },
    image: {
      type: Schema.Types.String,
      required: true
    },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: 'parentCategory',
      required: true
    },
    sort: {
      type: Schema.Types.Number,
      default: 1
    },
    wide: {
      type: Schema.Types.Boolean,
      required: true
    },
    isHidden: {
      type: Schema.Types.Boolean,
      default: false
    },
    forSmoking: {
      type: Schema.Types.Boolean,
      default: false
    },
    bio: {
      type: Schema.Types.String,
      required: true
    }
  },
  { timestamps: true }
);

const subCategoryModel: Model<SubCategory> = model<SubCategory>('subCategory', subCategorySchema);

export default subCategoryModel;
