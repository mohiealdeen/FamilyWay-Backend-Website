import express from 'express';
import dotenv from 'dotenv';
import Database from './Config/database';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import shell from 'shelljs';
import parentCategoryModel from './model/parentCategoryModel';
import constantsModel, { Constants } from './model/constantsModel';
import { cities } from './constant/constant';
var path = require('path');

dotenv.config();

const PORT = process.env.PORT || 5000;
const VERSION = process.env.VERSION || '1.5.0';

const app = express();
//* use helmet
app.use(helmet());
//* use compression to gzip responses
app.use(compression());
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(__dirname + '/upload'));

app.use('/public', express.static(__dirname + '/public'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// routers
const authRouter = require('./router/validatePhoneNumber');
const userRouter = require('./router/user');
const addressRouter = require('./router/address');
const parentCategory = require('./router/parentCategory');
const subCategory = require('./router/subCategory');
const thirdCategory = require('./router/thirdCategory');
const productsRouter = require('./router/product');
const cartRouter = require('./router/cart');
const orderRouter = require('./router/order');
const timeRouter = require('./router/time');
const constantsRouter = require('./router/constants');
const couponsRouter = require('./router/coupon');
const favRouter = require('./router/fav');
const homeSlider = require('./router/homeSlider');
const orderTimesRouter = require('./router/orderTimes');
const sliderCategoryRouter = require('./router/sliderCategory');
const companiesRouter = require('./router/companies');
const PushNotification = require('../src/controller/PushNotification');
const AdViewRouter = require('./router/adView');
const CardOrderRouter = require('./router/CardOrder');
const MailRouter = require('./router/mail');

app.use('/api/user', authRouter);
app.use('/api/user', userRouter);
app.use('/api/user', addressRouter);
app.use('/api/user', parentCategory);
app.use('/api/user', subCategory);
app.use('/api/user', thirdCategory);
app.use('/api/user', productsRouter);
app.use('/api/user', cartRouter);
app.use('/api/user', orderRouter);
app.use('/api/user', timeRouter);
app.use('/api/user', constantsRouter);
app.use('/api/user', couponsRouter);
app.use('/api/user', favRouter);
app.use('/api/user', homeSlider);
app.use('/api/user', orderTimesRouter);
app.use('/api/user', sliderCategoryRouter);
app.use('/api/user', companiesRouter);
app.use('/api/user', PushNotification);
app.use('/api/user', AdViewRouter);
app.use('/api/user', CardOrderRouter);
app.use('/api/user', MailRouter);

const callCategories = async () => {
  let categories = await parentCategoryModel.find();
  let array: Array<string> = [];
  categories.forEach(item => {
    array.push(item.name);
  });
  return array;
};

const getSocialAccounts = () => {
  return 1;
};

var statueOfPolitics: any = {
  whoUsText: null,
  usageAgreementText: null,
  privacyPolicyText: null,
  commonQuestionsText: null,
  termsAndConditionsText: null,
  suggestedToUsText: null,
  contactUsText: null
};

var mobileNumber: number = 1;

const contentOfPolitics = async () => {
  try {
    const constants: any = await constantsModel.findOne().sort('-created_at');
    mobileNumber = constants.mobileNumber;

    statueOfPolitics = {
      whoUsText: constants.whoUsText,
      usageAgreementText: constants.usageAgreementText,
      privacyPolicyText: constants.privacyPolicyText,
      commonQuestionsText: constants.commonQuestionsText,
      termsAndConditionsText: constants.termsAndConditionsText,
      suggestedToUsText: constants.suggestedToUsText,
      contactUsText: constants.contactUsText
    };
  } catch (error) {
    statueOfPolitics = {
      whoUsText: 'حدث خطأ',
      usageAgreementText: 'حدث خطأ',
      privacyPolicyText: 'حدث خطأ',
      commonQuestionsText: 'حدث خطأ',
      termsAndConditionsText: 'حدث خطأ',
      suggestedToUsText: 'حدث خطأ',
      contactUsText: 'حدث خطأ'
    };
    console.log(error);
  }
};
contentOfPolitics();

const getLinks = async (): Promise<any[]> => {
  const links = [
    { name: 'الرئيسية', route: '/' },
    { name: 'أماكن التغطية', route: '/cities' },
    { name: 'عن الشركة', route: '/about' },
    { name: 'اقسامنا', isDropdown: true, children: await callCategories() },
    { name: 'اتصل بنا', route: '/support' },
    { name: 'حمل التطبيق', route: '/download-app' }
  ];
  return links.reverse();
};

const foot = [
  { name: 'من نحن', route: 'who-us' },
  { name: 'اتفاقية الاستخدام', route: 'usage-agreement-text' },
  { name: 'سياسة الخصوصية', route: 'privacy-policy-text' },
  { name: 'لأسئلة الشائعة', route: 'common-questions-text' },
  { name: 'الشروط و الاحكام', route: 'terms-and-conditions-text' },
  { name: 'اقترح علينا', route: 'suggested-to-us-text' },
  { name: 'تواصل معنا', route: 'contact-us-text' }
];

app.get('/', async (req, res) => {
  res.render('pages/home', {
    items: await getLinks(),
    foot,
    cities,
    mobileNumber
  });
});

app.get('/cities/', async (req, res) => {
  res.render('pages/cities', {
    items: await getLinks(),
    foot,
    cities,
    mobileNumber
  });
});

app.get('/about/', async (req, res) => {
  res.render('pages/about', {
    items: await getLinks(),
    foot,
    mobileNumber
  });
});

app.get('/support/', async (req, res) => {
  res.render('pages/support', {
    items: await getLinks(),
    foot,
    mobileNumber
  });
});

app.get('/download-app/', async (req, res) => {
  res.render('pages/download', {
    items: await getLinks(),
    foot,
    mobileNumber
  });
});

app.get('/who-us/', async (req, res) => {
  res.render('pages/politicsWhoUs', {
    items: await getLinks(),
    foot,
    title: 'من نحن',
    content: statueOfPolitics.whoUsText,
    mobileNumber
  });
});

app.get('/usage-agreement-text/', async (req, res) => {
  res.render('pages/usageAgreementText', {
    items: await getLinks(),
    foot,
    title: 'اتفاقية الاستخدام',
    content: statueOfPolitics.usageAgreementText,
    mobileNumber
  });
});

app.get('/privacy-policy-text/', async (req, res) => {
  res.render('pages/privacyPolicyText', {
    items: await getLinks(),
    foot,
    title: 'سياسة الخصوصية',
    content: statueOfPolitics.privacyPolicyText,
    mobileNumber
  });
});

app.get('/common-questions-text/', async (req, res) => {
  res.render('pages/commonQuestionsText', {
    items: await getLinks(),
    foot,
    title: 'الأسئلة الشائعة',
    content: statueOfPolitics.commonQuestionsText,
    mobileNumber
  });
});

app.get('/terms-and-conditions-text/', async (req, res) => {
  res.render('pages/termsAndConditionsText', {
    items: await getLinks(),
    foot,
    title: 'الشروط و الاحكام',
    content: statueOfPolitics.termsAndConditionsText,
    mobileNumber
  });
});

app.get('/suggested-to-us-text/', async (req, res) => {
  res.render('pages/suggestedToUsText', {
    items: await getLinks(),
    foot,
    title: 'اقترح علينا',
    content: statueOfPolitics.suggestedToUsText,
    mobileNumber
  });
});

app.get('/contact-us-text/', async (req, res) => {
  res.render('pages/contactUsText', {
    items: await getLinks(),
    foot,
    title: 'تواصل معنا',
    content: statueOfPolitics.contactUsText,
    mobileNumber
  });
});

app.get('/secret-restart-123654', (req, res) => {
  shell.exec('~/auto/auto.sh');
});

app.listen(PORT, () => {
  console.log(`hosting @${PORT}`);
  Database();
});
