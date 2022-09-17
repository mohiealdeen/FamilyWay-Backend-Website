import { Request, Response, NextFunction } from 'express'
import userModel, { User } from '../model/userModel'
import addressModel, { Address } from '../model/addressModel'

exports.createAddress = async (
  req: Request & { user: User },
  res: Response
) => {
  try {
    const { user } = req

    const {
      name,
      locationName,
      lat,
      long,
      addressType,
      nearestLandmark,
      isPrimary,
      buildNumber,
      anyInstructions
    }: Address = req.body

    if (
      !name ||
      !locationName ||
      !addressType ||
      !anyInstructions ||
      !lat ||
      !long ||
      !buildNumber
    ) {
      return res.status(401).json({ error: 'data is required' })
    }

    const address = await addressModel.find({ user: user._id })

    if (address === undefined || address.length == 0) {
      await addressModel.create({
        user: user._id,
        name,
        locationName,
        lat,
        long,
        addressType,
        buildNumber,
        nearestLandmark,
        anyInstructions,
        isPrimary: true
      })
    } else {
      await addressModel.create({
        user: user._id,
        name,
        locationName,
        lat,
        long,
        addressType,
        buildNumber,
        nearestLandmark,
        anyInstructions,
        isPrimary: false
      })
    }

    const userAddress = await userModel.findOne({ _id: user._id })

    // @ts-ignore
    userAddress?.locations = address

    await userAddress?.save()

    res.status(200).json({ message: 'location is created!!!' })
  } catch (error) {
    // res.status(400).json({ error: error.message })
    res.status(400).json({ error: error })
  }
}

exports.getAddress = async (req: Request & { user: User }, res: Response) => {
  try {
    const { user } = req
    const addresses = await addressModel.find({ user: user._id })
    res.status(200).json({ addresses })
  } catch (error) {
    // res.status(400).json({ error: error.message })
    res.status(400).json({ error: error })
  }
}

exports.deleteAddress = async (
  req: Request & { user: User },
  res: Response
) => {
  try {
    const { user } = req
    const { id } = req.params
    console.log(id)
    const address = await addressModel.findByIdAndDelete(id)

    const userAddress = await userModel.findOneAndUpdate(
      { _id: user._id },
      { $pull: { locations: id } }
    )

    res.status(200).json({ message: 'Deleted!!!' })
  } catch (error) {
    // res.status(400).json({ error: error.message })
    res.status(400).json({ error: error })
  }
}

exports.updateAddressPrim = async (
  req: Request & { user: User },
  res: Response
) => {
  try {
    const { user } = req
    const { id } = req.params
    let address: any = await addressModel.updateMany(
      { user: user._id },
      { isPrimary: false }
    )

    const addressEdited = await addressModel.findByIdAndUpdate(
      { _id: id },
      { isPrimary: true }
    )
    res.status(200).json({ message: 'Updated!!!' })
  } catch (error) {
    // res.status(400).json({ error: error.message })
    res.status(400).json({ error: error })
  }
}
