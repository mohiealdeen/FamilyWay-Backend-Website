import { Schema, Model, model, Document } from 'mongoose'
import orderModel from './orderModel'

export interface OrderTimes extends Document {
  value: {
    from: string
    to: string
  }
  day: number
  isDisabled: boolean
  maxCount: number
  currentCount: number
}

const orderTimeSchema = new Schema({
  value: {
    from: {
      type: Schema.Types.String,
      required: true
    },
    to: {
      type: Schema.Types.String,
      required: true
    }
  },
  day: {
    type: Schema.Types.Number,
    required: true
  },
  isDisabled: {
    type: Schema.Types.Boolean,
    default: true
  },
  maxCount: {
    type: Schema.Types.Number,
    required: true
  },
  currentCount: {
    type: Schema.Types.Number,
    default: 0
  }
})

orderTimeSchema.post('init', async function (this: OrderTimes) {
  if (this.currentCount >= this.maxCount) {
    this.isDisabled = false
  }
})

const orderTimesModel: Model<OrderTimes> = model('OrderTimes', orderTimeSchema)

export default orderTimesModel
