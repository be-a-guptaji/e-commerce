import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const cookiesExtractor = (req, res) => {
  let token = null;

  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }

  return token;
};

export const isAuthenticated = (req, res, next) => {
  try {
    const token = cookiesExtractor(req, res);

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (decoded) {
        req.user = decoded;
      }
    });

    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const sanitizeUser = (user) => {
  const userObject = user.toObject();

  const id = userObject._id;
  userObject.id = id;

  if (!userObject.addresses) {
    userObject["addresses"] = [];
  }

  delete userObject.password;
  delete userObject.salt;
  delete userObject._id;
  delete userObject.__v;
  delete userObject.createdAt;
  delete userObject.updatedAt;

  return userObject;
};

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