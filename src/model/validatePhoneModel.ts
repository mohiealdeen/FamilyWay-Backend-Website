import { Schema, Document, model, Model } from 'mongoose'

interface ValidatePhone extends Document {
  user?: string
  code: number
  phone: number
  newNumber?: number
}

const validatePhoneSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  code: {
    type: Schema.Types.String,
    required: true,
    index: true
  },
  phone: {
    type: Schema.Types.Number,
    required: true,
    index: true,
    unique: true
  },
  newNumber: {
    type: Schema.Types.Number
  }
})

const validatePhoneModel: Model<ValidatePhone> = model<ValidatePhone>(
  'validatePhone',
  validatePhoneSchema
)

export default validatePhoneModel
