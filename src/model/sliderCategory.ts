import { Schema, Document, Model, model } from 'mongoose'

export interface SliderCategory extends Document {
  ref: string
  image: string
  isProduct?: Boolean
  action?: string
  category?: string
  sort?: number
}

const sliderCategorySchema = new Schema({
  ref: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'thirdCategory'
  },
  image: {
    type: Schema.Types.String,
    required: true
  },
  isProduct: { type: Schema.Types.Boolean },
  action: { type: Schema.Types.String, ref: 'Product' },
  category: { type: Schema.Types.String, ref: 'thirdCategory' },
  sort: {
    type: Schema.Types.Number,
    default: 1
  }
})

const sliderCategoryModel: Model<SliderCategory> = model(
  'SliderCategory',
  sliderCategorySchema
)

export default sliderCategoryModel
