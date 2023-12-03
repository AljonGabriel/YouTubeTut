import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import generateCode from './generateCode.js';

const sendCodeToUserEmail = async (userEmail) => {
  return new Promise((resolve, reject) => {
    let config = {
      service: 'Gmail',
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    };

    let transporter = nodemailer.createTransport(config);

    let MailGen = new Mailgen({
      theme: 'default',
      product: {
        name: 'Verification',
        link: 'www.Verification.com',
      },
    });

    let code = generateCode(6);

    let response = {
      body: {
        name: 'Guest',
        intro: `Code: ${code}`,
        outro: 'Please enter this code to the verification field',
      },
    };

    let mail = MailGen.generate(response);

    let message = {
      from: 'Verification',
      to: userEmail,
      subject: 'Access Code',
      html: mail,
    };

    transporter.sendMail(message).then(() => {
      console.log('Random Code:' + code);
      resolve(code);
    });
  });
};

export { sendCodeToUserEmail };
