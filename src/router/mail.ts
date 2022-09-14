import express from 'express';
const router = express.Router();
const { authorize } = require('../middleware/auth');
const { sendMail, getMails, getOneMail } = require('../controller/mail');

router
  .route('/mail')
  .post(sendMail)
  .get(getMails);

router.route('/mail/:id').get(getOneMail);

module.exports = router;
