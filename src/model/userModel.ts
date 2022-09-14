import { Schema, Document, model, Model, Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import { SECRET_HASH } from '../constant/constant';
import { generateKeyPair } from 'crypto';

interface DeliveryRate {
  orderReview?: string;
  orderRate?: number;
  // orderDetails: string;
}

export interface User extends Document {
  phone: number;
  points?: number;
  wallet?: number;
  name?: string;
  orders?: Array<any>;
  role?: string;
  deliveryRate?: Array<DeliveryRate>;
  locations?: Array<string>;
  createdAt?: Date;
  updatedAt?: Date;
  TOKEN_FCM: string;
  os: string;
  isBlocked?: Boolean;
  isInvited?: Boolean;
  codeInvites: string;
  img?: number;
  gender?: string;
  age?: number;
  nationality?: string;
  currentCity?: string;
  email?: string;
  instagram?: string;
  filledForm?: Boolean;
}

const userSchema = new Schema(
  {
    name: {
      type: Schema.Types.String
    },
    TOKEN_FCM: {
      type: Schema.Types.String
    },
    os: Schema.Types.String,
    phone: {
      type: Schema.Types.Number,
      required: true,
      unique: true,
      index: true
    },
    email: {
      type: Schema.Types.String
    },
    role: {
      type: Schema.Types.String,
      enum: ['USER', 'ADMIN', 'DRIVER'],
      default: 'ADMIN'
    },
    isInvited: {
      type: Schema.Types.Boolean,
      default: false
    },
    isBlocked: {
      type: Schema.Types.Boolean,
      default: false
    },
    deliveryRate: [
      {
        orderReview: {
          type: Schema.Types.ObjectId,
          ref: 'Order'
        },
        orderRate: {
          type: Schema.Types.Number,
          default: 0
        }
      }
    ],
    spins: {
      type: Schema.Types.Number,
      default: 100
    },
    locations: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Address'
      }
    ],
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Order'
      }
    ],
    wallet: {
      type: Schema.Types.Number,
      default: 0
    },
    points: {
      type: Schema.Types.Number,
      default: 0
    },
    codeInvites: {
      type: Schema.Types.String
    },
    img: {
      type: Schema.Types.Number
    },
    gender: {
      type: Schema.Types.String
    },
    age: {
      type: Schema.Types.Number
    },
    nationality: {
      type: Schema.Types.String
    },
    currentCity: {
      type: Schema.Types.String
    },
    instagram: {
      type: Schema.Types.String
    },
    filledForm: {
      type: Schema.Types.Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

userSchema.methods.getToken = function () {
  return jwt.sign({ _id: this._id }, SECRET_HASH, {
    expiresIn: '30d'
  });
};

const userModel: Model<User> = model('User', userSchema);

export default userModel;
