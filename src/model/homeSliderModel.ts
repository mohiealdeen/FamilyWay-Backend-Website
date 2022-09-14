import { Schema, Document, model, Model } from 'mongoose'

export interface HomeSlider extends Document {
  image: string
  isProduct?: Boolean
  action?: string
  category?: string
  sort?: number
}

const homeSliderSchema = new Schema({
  image: { type: Schema.Types.String, required: true },
  isProduct: { type: Schema.Types.Boolean },
  action: { type: Schema.Types.String, ref: 'Product' },
  category: { type: Schema.Types.String, ref: 'thirdCategory' },
  sort: {
    type: Schema.Types.Number,
    default: 1
  }
})

const homeSliderModel: Model<HomeSlider> = model('HomeSlider', homeSliderSchema)

export default homeSliderModel
