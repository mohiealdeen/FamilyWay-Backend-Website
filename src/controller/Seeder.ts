import { Request, Response, NextFunction } from 'express';
import XLSX from 'xlsx';
import productModel, { Product } from '../model/productModel';

exports.createProductsSeeder = async (req: Request, res: Response) => {
  try {
    const workbook = XLSX.readFile(__dirname + '/../Config/Sheet.xlsx');
    const sheet_name_list = workbook.SheetNames;
    var result: any = [];
    sheet_name_list.forEach(function (y) {
      var worksheet = workbook.Sheets[y];
      var headers: any = {};
      var data: any = [];
      var z;
      for (z in worksheet) {
        if (z[0] === '!') continue;
        //parse out the column, row, and value
        var col = z.substring(0, 1);
        // console.log(col);

        var row = parseInt(z.substring(1));
        // console.log(row);

        var value = worksheet[z].v;
        // console.log(value);
        if (value == '') {
          continue;
        }
        //store header names
        if (row == 1) {
          headers[col] = value;
          // storing the header names
          continue;
        }

        if (!data[row]) data[row] = {};
        if (headers[col] == 'categories') {
          console.log(1);
          data[row][headers[col]] = [value];
        } else if (headers[col] == 'unit') {
          data[row][headers[col]] = value.toString();
        } else {
          data[row][headers[col]] = value;
        }
      }
      //drop those first two rows which are empty
      data.shift();
      data.shift();
      result = data;
      // console.log(data);
    });
    const productsJSON: any = [...result];
    console.log(productsJSON)
    // const products = await productModel.create(productsJSON)
    res.status(200).send(productsJSON);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
