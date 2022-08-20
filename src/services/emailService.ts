import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

interface SendEmailOptions {
  email: string;
  subject: string;
  message: string;
}

const sendEmail = async (options: SendEmailOptions) => {
  // 1. Create a transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: 'monitor.newsbringer@gmail.com',
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: process.env.ACCESS_TOKEN,
    },
  });

  // 2. Define the email options
  const mailOptions: Mail.Options = {
    from: `Monitor ${process.env.EMAIL_USERNAME}`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3. Send the email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;