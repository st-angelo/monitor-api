import { User } from '@prisma/client';
import { htmlToText } from 'html-to-text';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import pug from 'pug';
import { __dirname } from '../utils/common';

interface SendEmailOptions {
  email: string;
  subject: string;
  html?: string;
  text?: string;
}

//#region Private

const getTransport = () => {
  if (process.env.ENVIRONMENT === 'production') {
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_PASSWORD,
      },
    });
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 0,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

const sendEmail = async (options: SendEmailOptions) => {
  // 1. Create a transporter
  const transport = getTransport();

  // 2. Define the email options
  const mailOptions: Mail.Options = {
    from: `Monitor ${process.env.EMAIL}`,
    to: options.email,
    subject: options.subject,
    html: options.html,
    text: options.text,
  };

  // 3. Send the email
  await transport.sendMail(mailOptions);
};

//#endregion

export const sendWelcomeEmail = async ({ name, nickname, email }: User, token: string, hostUrl: string) => {
  const subject = 'Welcome to Monitor';

  const html = pug.renderFile(`${__dirname}/resources/templates/welcome.pug`, {
    name: nickname ?? name,
    homeUrl: process.env.CLIENT_URL,
    verifyUrl: `${hostUrl}/api/v1/user/verify?email=${email}&token=${token}`,
    subject,
  });

  await sendEmail({
    email,
    subject,
    html,
    text: htmlToText(html),
  });
};

export const sendResetPasswordEmail = async ({ name, nickname, email }: User, token: string, hostUrl: string) => {
  const subject = 'Reset your password';

  const html = pug.renderFile(`${__dirname}/resources/templates/resetPassword.pug`, {
    name: nickname ?? name,
    resetUrl: `${hostUrl}/resetPassword?token=${token}`,
    subject,
  });

  await sendEmail({
    email,
    subject,
    html,
    text: htmlToText(html),
  });
};
