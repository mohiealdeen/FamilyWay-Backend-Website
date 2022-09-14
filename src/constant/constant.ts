export const reqUrl = 'https://familyway.sa/api/user/';

export enum Role {
  ADMIN,
  USER,
  DRIVER
}

export const cities = ['الخبر', 'الإحساء', 'الخرج', 'المدينة المنورة', 'عنيزة', 'الدمام', 'جده', 'الرياض'];

export const orderStatus = {
  review: 0,
  processed: 1,
  Preparation: 2,
  delivering: 3,
  shipped: 4,
  reviewForReturn: 5,
  returned: 6,
  notReturned: 7,
  rejected: 8
};

export const orderConstants = {
  highDelivery: 15,
  lowDelivery: 10,
  minimum: 40,
  freeDelivery: 100
};

export const SECRET_HASH: string = 'devilkingdom';

export const CATEGORIES_FILE_MAX: number = 1000000;

export const percentConvertor = (totalCost: number, percent: number) => {
  return totalCost * (percent / 100);
};

export function generateCoupons (length: number) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result.toUpperCase();
}

export const paginateIt = async (pageQuery: string, limitQuery: string, model: any) => {
  var page: number = parseInt(pageQuery, 10) || 1;
  var limit: number = parseInt(limitQuery, 10) || 10;
  var startIndex: number = (page - 1) * limit;

  var endIndex = page * limit;
  var total = await model.countDocuments();

  var pagination: {
    next?: {
      page?: number;
      limit?: number;
    };
    prev?: {
      page?: number;
      limit?: number;
    };
  } = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }
  return { pagination, startIndex, limit };
};
