import { NextFunction, Response } from 'express'
import { Document, Schema, Model, model } from 'mongoose'
import { Product } from './productModel'

export interface Cart extends Document {
  _id: any
  user: string
  product:any
  count: number
  price?: number
  totalPrice?: number
}

const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    count: {
      type: Schema.Types.Number,
      required: true
    },
    price: {
      type: Schema.Types.Number
    },
    totalPrice: {
      type: Schema.Types.Number
    }
  },
  { timestamps: true }
)

cartSchema.methods.checkUserMax = async function (
  increaseCount: number,
  res: Response,
  next: NextFunction
) {
  try {
    // start handle if user is out of stock or out of userMax
    if (this.count + increaseCount > this.product.userMax) {
      return res.status(403).json({ message: 'this user cant add any more' })
    }
    if (this.count + increaseCount > this.product.inStock) {
      return res.status(404).json({ message: 'this user cant add any more' })
    }
    this.count += increaseCount
    // end handle if user is out of stock or out of userMax

    // start handle if product is Have a discount and calculate the totalPrice
    if (this.product.discount == 0 || this.product.discount == null) {
      this.price = this.product.price
    } else {
      this.price = this.product.discount
    }
    this.totalPrice = this.price * this.count
    // end handle if product is Have a discount and calculate the totalPrice
    // Save
    await this.save()
  } catch (error) {
    res.status(402).json({ error: error.message })
  }
}

cartSchema.methods.calcPrice = async function () {
  // start handle if product is Have a discount and calculate the totalPrice
  if (this.product.discount == 0 || this.product.discount == null) {
    this.price = this.product.price
  } else {
    this.price = this.product.discount
  }
  this.totalPrice = this.price * this.count
  // end handle if product is Have a discount and calculate the totalPrice
  await this.save()
}

const cartModel: Model<Cart> = model('Cart', cartSchema)

export default cartModel
