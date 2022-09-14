import { Schema, Document, model, Model } from 'mongoose'

export interface Fav extends Document {
  user: string
  products: Array<string>
}

const favSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Product'
    }
  ]
})


favSchema.post('init', async function () {
  // @ts-ignore
  var doc: Fav = this
  // if (doc.products == null) {
  //   // @ts-ignore
  //   doc = null
  //   doc.save()
  // }
  console.log(doc)
})

const favModel: Model<Fav> = model('Fav', favSchema)

export default favModel
