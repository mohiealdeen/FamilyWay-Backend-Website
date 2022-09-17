import { Schema, Document, model, Model } from 'mongoose'
// @ts-ignore
import random from 'mongoose-simple-random'

export interface Address extends Document {
  user: string
  locationName: string
  name: string
  addressType: string
  nearestLandmark?: string | null
  anyInstructions?: string
  isPrimary?: boolean
  buildNumber: number
  lat: number
  long: number
}

const AddressSchema = new Schema(
  {
    user: {
      type: Schema.Types.String,
      ref: 'User',
      required: true
    },
    locationName: {
      type: Schema.Types.String,
      required: true
    },
    name: {
      type: Schema.Types.String,
      required: true
    },
    buildNumber: {
      type: Schema.Types.String,
      required: true
    },
    lat: {
      type: Schema.Types.Number,
      required: true
    },
    long: {
      type: Schema.Types.Number,
      required: true
    },
    addressType: {
      type: Schema.Types.String,
      required: true,
      enum: ['شقة', 'فيلا', 'كمباوند', 'شركة', 'محل', 'مدرسة']
    },
    nearestLandmark: Schema.Types.String,
    anyInstructions: {
      type: Schema.Types.String,
      required: true
    },
    isPrimary: {
      type: Schema.Types.Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)
AddressSchema.plugin(random)

const addressModel: Model<Address> = model<Address>('Address', AddressSchema)

export default addressModel
