import nodemailer from 'nodemailer';
import { MAIL_LOGIN, MAIL_PORT, MAIL_PWD, MAIL_SMTP_SERVER } from '../config';

const port = parseInt(MAIL_PORT || '');

const transporter = nodemailer.createTransport({
  host: MAIL_SMTP_SERVER,
  port: port,
  secure: false,
  auth: {
    user: MAIL_LOGIN,
    pass: MAIL_PWD,
  },
  service: MAIL_SMTP_SERVER,
});

export default transporter;
