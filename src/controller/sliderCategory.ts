import { Request, Response } from 'express';
import sliderCategoryModel from '../model/sliderCategory';
import Jimp from 'jimp';

exports.createSliderCategory = async (req: Request, res: Response) => {
  try {
    const { ref } = req.body;
    const image = req.file;

    if (!ref) {
      res.status(401).json({ error: 'Data is Required' });
    }

    const { isProduct, action, sort, category } = req.body;

    await sliderCategoryModel.create({
      ref,
      image: image.filename,
      isProduct,
      category,
      action,
      sort
    });

    // const uploadPath: string = __dirname + '/../upload/sliderCategory/' + req.file.filename;
    // try {
    //   const img = await Jimp.read(uploadPath);
    //   img.resize(400, 200).write(__dirname + '/../upload/sliderCategory/' + req.file.filename);
    // } catch (error) {
    //   if (error) return res.json(error);
    // }

    res.status(200).json({ message: 'created' });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.getSliderCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sliderCategory = await sliderCategoryModel
      .find({ ref: id })
      .populate('action')
      .populate('category');
    res.status(200).json({ sliderCategory });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.deleteSlider = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sliderCategory = await sliderCategoryModel.findByIdAndDelete(id);
    res.status(200).send('deleted!!');
  } catch (error) {
    res.status(500).json(error.message);
  }
};
