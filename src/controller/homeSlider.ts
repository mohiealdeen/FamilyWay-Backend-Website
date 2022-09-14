import { Request, Response, NextFunction } from 'express';
import homeSliderModel from '../model/homeSliderModel';
import { MulterError } from 'multer';
import Jimp from 'jimp';
import companyModel from '../model/companies';

exports.createSlider = async (req: Request, res: Response) => {
  try {
    const imageFileName = req.file.filename;
    const { isProduct, action, sort, category } = req.body;

    await homeSliderModel.create({
      image: imageFileName,
      isProduct,
      category,
      action,
      sort
    });

    // const uploadPath: string = __dirname + '/../upload/sliders/' + req.file.filename;
    // try {
    //   const img = await Jimp.read(uploadPath);
    //   img.resize(420, Jimp.AUTO).write(__dirname + '/../upload/sliders/' + req.file.filename);
    // } catch (error) {
    //   if (error) return res.json(error);
    // }
    res.status(200).send('added');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createSliderCompanies = async (req: Request, res: Response) => {
  try {
    if (req.file) {
      await companyModel.create({
        name: req.body.name,
        image: req.file.filename
      });
      res.status(200).send('created');
    } else {
      res.status(401).json({ error: 'cant upload this photo' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllSlidersCompanies = async (req: Request, res: Response) => {
  try {
    const companies = await companyModel.find();
    res.status(200).send(companies);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteSliderCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await companyModel.findByIdAndDelete(id);
    res.status(200).send('deleted!!');
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.sliders = async (req: Request, res: Response) => {
  try {
    const homeSlider = await homeSliderModel
      .find()
      .populate('action')
      .populate('category');

    res.status(200).send(homeSlider);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteSlider = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(id);
    await homeSliderModel.findByIdAndDelete(id);
    res.status(200).send('deleted!!');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateSlider = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await homeSliderModel.findByIdAndUpdate(id, req.body);
    res.status(200).send('updated!!');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
