import asynchandler from 'express-async-handler';
import { sendCodeToUserEmail } from '../utils/emailUtils.js';

const checkDataThenSendCode = asynchandler(async (req, res) => {
  const { feEmail } = req.body;

  if (!feEmail) {
    res.status(400).json({ Error: "Email can't be empty" });
  }

  const code = await sendCodeToUserEmail(feEmail);

  if (code) {
    req.session.verificationCode = code;
    res.status(200).json({ msg: `Code sent successfully: ${code}` });
  }

  console.log(code);
});

const verifyCode = asynchandler(async (req, res) => {
  const { feVerificationCode } = req.body;

  if (!feVerificationCode) {
    res.status(400).json({ Error: "Verification can't be empty" });
  }

  const storedCode = req.session.verificationCode;

  if (feVerificationCode === storedCode) {
    res.status(200).json({ msg: 'Code verification success.' });
  } else {
    res.status(400).json({ Error: 'Code is invalid' });
  }
});

export { checkDataThenSendCode, verifyCode };
