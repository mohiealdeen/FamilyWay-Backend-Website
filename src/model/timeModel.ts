import { Schema, Document, model, Model } from 'mongoose'

export interface Time extends Document {
  days: number
  hours: number
}

const timeSchema = new Schema(
  {
    days: {
      type: Number,
      required: true
    },
    hours: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
)

const timeModel: Model<Time> = model('Time', timeSchema)

export default timeModel
