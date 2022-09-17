import { Request, Response } from 'express';
import ValidatePhoneModel from '../model/validatePhoneModel';
import Axios from 'axios';
import userModel, { User } from '../model/userModel';
import { generateCoupons } from '../constant/constant';

// const uniCoded = `%D8%A7%D9%84%D9%83%D9%88%D8%AF%20%D8%A7%D9%84%D8%AE%D8%A7%D8%B5%20%D8%A8%D9%83%20%D9%87%D9%88%20`;
// `https://www.hisms.ws/api.php?send_sms&username=966545039695&password=As1020@as1020&numbers=+966${number}&sender=batikhapp&message=${uniCoded}${code}`

/**
 * create ValidatePhoneModel
 */

const sendCode = async (code: number, number: number) => {
  const resApi = await Axios.get(
    `http://hisms.ws/api.php?send_sms=Family way confirm code&username=966591917472&password=515555asdfghTT&numbers=${number}&sender=Family Way&message=${code}`
  );
  console.log(resApi.data);
};

exports.create = async (req: Request, res: Response) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(401).json({ message: 'phone required' });
  }
  try {
    //check if exist
    const oldValidator = await ValidatePhoneModel.findOne({ phone });
    if (oldValidator !== null) {
      const newCode = Math.ceil(Math.random() * (10000 - 1000) + 1000);
      oldValidator.code = newCode;
      await oldValidator.save();
      console.log(newCode);
      await sendCode(newCode, phone);
      return res.status(200).json({ message: 'updated', code: newCode });
      // send verification code
    } else {
      const newCode = Math.ceil(Math.random() * (10000 - 1000) + 1000);
      await ValidatePhoneModel.create({
        phone,
        code: newCode,
        newNumber: Math.floor(Math.random() * 999999999999)
      });
      // send verification code
      await sendCode(newCode, phone);

      console.log(newCode);
      return res.status(200).json({ message: 'created', code: newCode });
    }
  } catch (error) {
    console.log(error);
    // return res.status(500).json(error.message);
    return res.status(500).json(error);
  }
};

/**
 * Validate ValidatePhoneModel
 */
exports.validate = async (req: Request, res: Response) => {
  const { code, phone, TOKEN_FCM, os } = req.body;
  try {
    const validator = await ValidatePhoneModel.findOne({ phone });
    if (validator == null) {
      return res.status(404).json({ message: 'not found' });
    }
    // if (!TOKEN_FCM) {
    //   return res.status(403).json({ message: 'FCM Token is not found' });
    // }
    if (code != validator.code) {
      return res.status(401).json({ message: 'wrong code' });
    }
    if (code == validator.code) {
      const userIsHere = await userModel.findOne({ phone });
      console.log(userIsHere);
      if (userIsHere != null) {
        // @ts-ignore
        const token = userIsHere.getToken();
        res.status(200).json({ user: userIsHere, token });
      } else {
        const createUser = await userModel.create({
          phone,
          TOKEN_FCM,
          os,
          codeInvites: generateCoupons(8)
        });
        // @ts-ignore
        const token = createUser.getToken();
        res.status(200).json({ user: createUser, token });
      }
    }
  } catch (error) {
    // return res.status(500).send(error.message);
    return res.status(500).send(error);
  }
};

exports.changeNumber = async (req: Request & { user: any }, res: Response) => {
  try {
    const { newNumber } = req.body;
    const { user } = req;
    const newCode = await Math.ceil(Math.random() * (10000 - 1000) + 1000);

    const allPhone: any = await ValidatePhoneModel.findOne({
      phone: newNumber
    });

    if (allPhone != null) {
      res.status(401).json({ user: 'this number is already singed up' });
    }

    await ValidatePhoneModel.findOneAndUpdate(
      { phone: user.phone },
      {
        code: newCode,
        newNumber: newNumber
      }
    );

    await sendCode(newCode, newNumber);

    res.status(200).json({ user: 'send code to this number', newCode });
  } catch (error) {
    // return res.status(400).send(error.message);
    return res.status(400).send(error);
  }
};

exports.validateChangeNumber = async (req: Request & { user: User }, res: Response) => {
  try {
    const { code, newNumber } = req.body;
    const { user } = req;
    const oldNumValidate: any = await ValidatePhoneModel.findOne({
      phone: user.phone
    });
    if (oldNumValidate.code == code && oldNumValidate.newNumber == newNumber) {
      oldNumValidate.phone = newNumber;
      oldNumValidate.newNumber = undefined;
      await oldNumValidate.save();
      await userModel.findByIdAndUpdate(user._id, { phone: newNumber });
    } else {
      return res.status(400).send({ error: 'wrong data' });
    }

    res.status(200).json({ user: 'number is changed!!!' });
  } catch (error) {
    // return res.status(400).send(error.message);
    return res.status(400).send(error);
  }
};
