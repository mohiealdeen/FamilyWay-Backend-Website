import { Response, Request, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import userModel from '../model/userModel'
import { SECRET_HASH } from '../constant/constant'

exports.protect = async (
  req: Request & { user: any },
  res: Response,
  next: NextFunction
) => {
  var token: any = req.headers.authorization
  if (!token) {
    res.status(401).json({ Auth: 'Not Authorize to access this route' })
  }
  token = token?.split(' ')[1]
  try {
    const decode: any = jwt.verify(token, SECRET_HASH)
    req.user = await userModel.findById(decode._id).populate("locations")
    next()
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// exports.protectVerify = async (
//   req: Request & { user: any },
//   res: Response,
//   next: NextFunction
// ) => {
//   const { user } = req
//   try {
//     if (!user.isActive) {
//       res.status(400).json({ message: 'Your account is not verified' })
//     } else {
//       next()
//     }
//   } catch (error) {
//     res.status(400).json({ message: error.message })
//   }
// }

exports.authorize = (...roles: Array<string>) => {
  return (
    req: Request & { user: { role: string } },
    res: Response,
    next: NextFunction
  ) => {
    console.log(req.user.role)
    if (!roles.includes(req.user.role)) {
      return res.status(400).json({
        message: `User Role ${req.user.role} is not authorized to access this route`
      })
    }
    next()
  }
}
