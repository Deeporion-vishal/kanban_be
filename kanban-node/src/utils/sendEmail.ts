import nodemailer from "nodemailer";
import { Address } from "nodemailer/lib/mailer";

const sendEmail = async (to: string, subject: string, text: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions, (error, result) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + result);
    }
  });
};

export default sendEmail;
