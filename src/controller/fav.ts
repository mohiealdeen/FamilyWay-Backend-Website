import { Request, Response, NextFunction } from 'express'
import userModel, { User } from '../model/userModel'
import favModel from '../model/favModel'

exports.addToFav = async (req: Request & { user: User }, res: Response) => {
  try {
    const { user }: any = req
    const { products }: any = req.body

    const fav = await favModel.find({ user })

    if (fav.length != 0) {
      if (fav[0].products.includes(products)) {
        // @ts-ignore
        const newFave = await fav[0].products.filter(ele => ele != products)

        fav[0].products = newFave
        // @ts-ignore
        await fav[0].save()
        res.status(200).json({ message: 'Deleted' })
      } else {
        // @ts-ignore
        fav[0].products.push(products)
        // @ts-ignore
        await fav[0].save()
        res.status(200).json({ message: 'added' })
      }
    } else {
      await favModel.create({
        user,
        products
      })
      res.status(200).json({ message: 'created' })
    }
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.getFav = async (req: Request & { user: User }, res: Response) => {
  try {
    const { user } = req
    const fav = await favModel
      .findOne({ user: user._id })
      .populate('products')
    res.status(200).json({ favorites: fav ? fav.products : [] })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
