import orderModel from '../model/orderModel';
import productModel from '../model/productModel';
import userModel from '../model/userModel';

const ProductsFunctions = {
  handlePrice: (query: any) => {
    let queryStr: any = JSON.stringify(query);
    queryStr = queryStr.replace(/\b(lt|lte|gt|gte|in)\b/, (item: string) => `$${item}`);
    queryStr = JSON.parse(queryStr);
    return queryStr;
  },
  handleSelect: (queryStr: any) => {
    if (queryStr.select) {
      let fields: string;
      fields = queryStr.select.split(',').join(' ');
      return fields;
    }
  },
  handlePagination: async (isCategory: boolean, id: string, query: any) => {
    let { page, limit } = query;
    if (page || limit) {
      page = parseInt(page, 10);
      limit = parseInt(limit, 10);

      var startIndex: number = (page - 1) * limit || 0;
      var skip: number = limit || 3;
      var endIndex: number = limit * page;
      var totalItems: number;
      if (isCategory) {
        let products = await productModel.find({
          categories: id
        });
        totalItems = products.length;
      } else {
        totalItems = await productModel.countDocuments();
      }

      var pagination: any = { limit, totalItems };

      if (endIndex < totalItems) {
        pagination.nextPage = page + 1;
      }

      if (totalItems > 0) {
        pagination.prevPage = page - 1;
      }

      return { startIndex, skip, pagination };
    } else {
      startIndex = 0;
      skip = 9999;
      pagination = null;
      return { startIndex, skip, pagination };
    }
  },
  handleUserPagination: async (query: any) => {
    let { page, limit } = query;
    if (page || limit) {
      page = parseInt(page, 10);
      limit = parseInt(limit, 10);

      var startIndex: number = (page - 1) * limit || 0;
      var skip: number = limit || 3;
      var endIndex: number = limit * page;
      var totalItems: number = await userModel.countDocuments();
      var pagination: any = { limit, totalItems };

      if (endIndex < totalItems) {
        pagination.nextPage = page + 1;
      }

      if (totalItems > 0) {
        pagination.prevPage = page - 1;
      }

      return { startIndex, skip, pagination };
    } else {
      startIndex = 0;
      skip = 999;
      pagination = null;
      return { startIndex, skip, pagination };
    }
  },
  handleOrderPagination: async (query: any) => {
    let { page, limit } = query;
    if (page || limit) {
      page = parseInt(page, 10);
      limit = parseInt(limit, 10);

      var startIndex: number = (page - 1) * limit || 0;
      var skip: number = limit || 3;
      var endIndex: number = limit * page;
      var totalItems: number = await orderModel.countDocuments();
      var pagination: any = { limit, totalItems };

      if (endIndex < totalItems) {
        pagination.nextPage = page + 1;
      }

      if (totalItems > 0) {
        pagination.prevPage = page - 1;
      }

      return { startIndex, skip, pagination };
    } else {
      startIndex = 0;
      skip = 999;
      pagination = null;
      return { startIndex, skip, pagination };
    }
  }
};

export default ProductsFunctions;
