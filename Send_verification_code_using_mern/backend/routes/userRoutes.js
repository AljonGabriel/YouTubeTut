import express from 'express';
const router = express.Router();

import {
  checkDataThenSendCode,
  verifyCode,
} from '../controller/userControllers.js';

router.post('/check', checkDataThenSendCode);
router.post('/code', verifyCode);

export default router;
