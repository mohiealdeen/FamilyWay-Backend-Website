import { Request, Response, NextFunction } from 'express';
import ProductsFunctions from '../Config/productsFunctions';
import constantsModel from '../model/constantsModel';
import userModel, { User } from '../model/userModel';
import fs from 'fs';
// @ts-ignore
import json2xls from 'json2xls';

exports.userData = async (req: Request & { user: User }, res: Response) => {
  try {
    const { user } = req;
    res.status(200).json({ user: user.populate('orders') });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

interface Pagination {
  startIndex: number;
  skip: number;
  pagination: object;
  limit?: number;
  totalItems?: number;
}

exports.getAllUsers = async (req: Request & { user: User }, res: Response) => {
  try {
    let queryStr: any = req.query;
    let phoneSearch: number = parseInt(queryStr.phoneSearch, 10);
    let nameSearch: string = queryStr.nameSearch;
    let paginate = await ProductsFunctions.handleUserPagination(queryStr);
    let removeFields: Array<string> = ['page', 'limit'];

    const { startIndex, skip, pagination }: Pagination = paginate;
    removeFields.forEach((params: string) => delete queryStr[params]);

    if (phoneSearch) {
      const usersHavePhone = await userModel.find({ phone: phoneSearch });
      return res.status(200).send({ users: usersHavePhone });
    }
    if (nameSearch) {
      const usersHaveName = await userModel.find({ name: nameSearch });
      return res.status(200).send({ users: usersHaveName });
    }

    const users = await userModel
      // @ts-ignore
      .find()
      .skip(startIndex)
      .limit(skip);

    return res.status(200).send({ pagination, users });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getUser = async (req: Request & { user: User }, res: Response) => {
  try {
    const { id } = req.params;
    const user = await userModel.findOne({ _id: id }).populate('orders');
    return res.status(200).send(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.changeName = async (req: Request & { user: User }, res: Response) => {
  try {
    const { user } = req;
    const { newName } = req.body;
    console.log(user);
    const getUser: any = await userModel.findById(user._id);

    getUser.name = newName;
    await getUser.save();

    res.status(200).json({ getUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.editUser = async (req: Request & { user: User }, res: Response) => {
  try {
    const phone = parseInt(req.params.phone, 10);
    const users = await userModel.findOneAndUpdate({ phone }, req.body);
    res.status(200).send('Updated');
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.fillForm = async (req: Request & { user: User }, res: Response) => {
  try {
    console.log('filled');
    const { img, age, nationality, currentCity, instagram, email } = req.body;
    const phone = parseInt(req.params.phone, 10);
    const constants: any = await constantsModel.findOne().sort('-created_at');
    console.log(typeof phone, phone);
    await userModel.findOneAndUpdate(
      { phone },
      { img, age, nationality, currentCity, instagram, email, filledForm: true, $inc: { wallet: constants.formGift } },
      { new: true, upsert: true }
    );

    res.status(200).send('Updated');
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.applyFriend = async (req: Request & { user: User }, res: Response) => {
  try {
    const { friendId } = req.body;
    const { user } = req;
    // @ts-ignore
    const friendUser: any = await userModel.findOne({ codeInvites: friendId });
    if (!friendUser) {
      return res.status(401).json({ message: 'wrong code' });
    }

    if (friendUser.codeInvites == user.codeInvites) {
      return res.status(402).json({ message: 'this is your code :D' });
    }

    const constants: any = await constantsModel.findOne().sort('-created_at');
    friendUser.wallet += constants.invites;
    user.isInvited = true;
    user.wallet += constants.invites;

    await friendUser.save();
    await user.save();

    res.status(200).send('HappyHacking!!');
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.createXLSFile = async (req: Request & { user: User }, res: Response) => {
  try {
    const users = await userModel.find();

    var xls = json2xls(users, {
      fields: [
        'name',
        'phone',
        'points',
        'wallet',
        'role',
        'createdAt',
        'os',
        'isBlocked',
        'codeInvites',
        'gender',
        'age',
        'nationality',
        'currentCity',
        'email',
        'instagram',
        'filledForm'
      ]
    });

    fs.writeFileSync(`${__dirname}/../upload/excelFilesForUsers/${Date.now().toString()}.xls`, xls, 'binary');

    res.status(200).send('Created!!');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getXLSFiles = async (req: Request & { user: User }, res: Response) => {
  try {
    var arrayOfImages: any[] = [];
    fs.readdir(`${__dirname}/../upload/excelFilesForUsers`, (err, list) => {
      if (err) {
        return res.status(401).json({ message: err });
      }
      for (let i = 0; i < list.length; i++) {
        arrayOfImages.push(list[i]);
      }
      return res.status(200).send(arrayOfImages);
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteFileXLS = async (req: Request & { user: User }, res: Response) => {
  try {
    const { name } = req.params;
    fs.unlinkSync(`${__dirname}/../upload/excelFilesForUsers/${name}`);
    return res.status(200).send("removed");
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
