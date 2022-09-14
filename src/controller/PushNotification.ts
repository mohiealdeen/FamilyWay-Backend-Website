import express, { Request, Response, NextFunction } from 'express';
import PushController from '../Config/PushController';
import userModel from '../model/userModel';
const router = express.Router();

const sendNotification = async (req: Request, res: Response) => {
  try {
    if (req.body.hasOwnProperty('forOne')) {
      const user: any = await userModel.findOne({ phone: req.body.phoneNumber });
      PushController(user.TOKEN_FCM, req.body.notification);
      return res.status(200).send('sent');
    } else {
      const users = await userModel.find().select('TOKEN_FCM');
      const results: any = [];
      await users.forEach(item => {
        if (item.TOKEN_FCM) {
          results.push(item.TOKEN_FCM);
        }
      });
      PushController(results, req.body.notification);
      return res.status(200).send('sent');
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

router.route('/notification').post(sendNotification);

module.exports = router;
