import nodemailer from "nodemailer";

export const sendEMail = async (req, res) => {
  try {
    const { to } = req.body;

    // Simple validation for 'to' email address
    if (!to || !/\S+@\S+\.\S+/.test(to)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

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
      to: to, // recipient address
      subject: "Hello feasdf", // Subject line
      text: "Kesa das", // plain text body
      html: "<b>ffsafasasGfasfndu rasfas jfa ek second</b>", // HTML body
    });

    return res.status(200).json({ message: "Email sent successfully", info });
  } catch (error) {
    // Log the error and return a user-friendly message
    console.error("Error sending email:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
};
