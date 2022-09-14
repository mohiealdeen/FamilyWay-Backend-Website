const fs = require('fs').promises;
const directory = `${__dirname}/../upload/AdView`;
const  subCategoryModel  = require('../model/subCategoryModel');

const cleanDB = async () => {
  // fs.rmdir(directory, { recursive: true }).then(() => console.log('directory removed!'));
};

cleanDB();
