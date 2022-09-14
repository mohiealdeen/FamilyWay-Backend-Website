import { Request, Response, NextFunction } from 'express';
import mailModel from '../model/mailModel';

exports.sendMail = async (req: Request, res: Response) => {
  try {
    const { name, phone, emailAddress, message } = req.body;

    console.log(name, phone, emailAddress, message)
    
    if (!name || !phone || !emailAddress || !message) {
      return res.status(401).send('data is required');
    }

    await mailModel.create({
      name,
      phone,
      emailAddress,
      message
    });
    return res.status(200).send('sent!!');
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

exports.getMails = async (req: Request, res: Response) => {
  try {
    const mails = await mailModel.find();
    return res.status(200).send(mails);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

exports.getOneMail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(401).send('id is required');
    }
    const mail = await mailModel.findOne({ _id: id });
    return res.status(200).send(mail);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};
