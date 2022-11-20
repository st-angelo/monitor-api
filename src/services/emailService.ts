import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

interface SendEmailOptions {
  email: string;
  subject: string;
  message: string;
}

const sendEmail = async (options: SendEmailOptions) => {
  // 1. Create a transporter
  const transport = getTransport();

  // 2. Define the email options
  const mailOptions: Mail.Options = {
    from: `Monitor ${process.env.EMAIL}`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3. Send the email
  await transport.sendMail(mailOptions);
};

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

export default sendEmail;
