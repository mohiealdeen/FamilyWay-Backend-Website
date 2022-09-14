import { Request, Response, NextFunction } from 'express'
import timeModel from '../model/timeModel'

exports.getTime = async (req: Request, res: Response) => {
  try {
    const time = await timeModel.find()
    res.status(200).json({ time })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.updateTime = async (req: Request, res: Response) => {
  try {
    const { days, hours } = req.body
    const time = await timeModel.findOneAndUpdate(
      {
        _id: '5f526156dd7c19369cc347a5'
      },
      { days, hours }
    )
    res.status(200).json({ message: 'Updated' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
