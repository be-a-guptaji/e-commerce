import nodemailer from "nodemailer";

export const sendEMail = async ({ to, subject, text, html }) => {
  try {
    // Create a transporter object using your SMTP service or transporter config
    const transporter = nodemailer.createTransport({
      service: "gmail", // or your preferred service
      auth: {
        user: process.env.EMAIL_ID, // Ensure you store sensitive info securely
        pass: process.env.EMAIL_PASSWORD, // Environment variables are ideal here
      },
    });

    const info = await transporter.sendMail({
      from: `"E Kart" <${process.env.EMAIL_ID}>'`, // sender address
      to, // recipient address
      subject, // Subject line
      text, // plain text body
      html, // HTML body
    });

    return info;
  } catch (error) {
    return null;
  }
};