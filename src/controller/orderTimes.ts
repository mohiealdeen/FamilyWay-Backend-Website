import { User } from '../model/userModel'
import { Request, Response, NextFunction } from 'express'
import orderTimesModel from '../model/orderTimes'

exports.createOrderTime = async (
  req: Request & { user: User },
  res: Response
) => {
  try {
    const { from, to } = req.body.value

    if (!from && !to) {
      res.status(401).json({ error: 'Data is required' })
    }
    const orderTimes = await orderTimesModel.create(req.body)
    res.status(200).json({ message: 'created' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.getAllTimesOrder = async (
  req: Request & { user: User },
  res: Response
) => {
  try {
    const orderTimes = await orderTimesModel.find()
    res.status(200).send(orderTimes)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.UpdateTimesOrder = async (
  req: Request & { user: User },
  res: Response
) => {
  try {
    const { id } = req.params
    const orderTimes = await orderTimesModel.findByIdAndUpdate(id, req.body)

    res.status(200).json({ message: 'Updated!' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.DeleteTimesOrder = async (
  req: Request & { user: User },
  res: Response
) => {
  try {
    const { id } = req.params
    const orderTimes = await orderTimesModel.findByIdAndDelete(id)

    res.status(200).json({ message: 'Deleted!' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
