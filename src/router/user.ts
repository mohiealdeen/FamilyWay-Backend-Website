import express from 'express';
const router = express.Router();
const {
  userData,
  changeName,
  getAllUsers,
  editUser,
  applyFriend,
  fillForm,
  getUser,
  createXLSFile,
  getXLSFiles,
  deleteFileXLS
} = require('../controller/user');
const { protect, authorize } = require('../middleware/auth');

router.route('/data').get(protect, userData);

router.route('/users').get(protect, authorize('ADMIN'), getAllUsers);

router.route('/oneUser/:id').get(protect, authorize('ADMIN'), getUser);

router.route('/changeName').post(protect, changeName);

router.route('/updateUser/:phone').put(protect, editUser);

router.route('/fillForm/:phone').put(protect, fillForm);

router.route('/applyInvite').post(protect, applyFriend);

router.route('/exportUsers').post(protect, authorize('ADMIN'), createXLSFile).get(getXLSFiles)

router.route('/exportUsers/:name').delete(deleteFileXLS);

module.exports = router;
