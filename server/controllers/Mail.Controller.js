import crypto from "crypto";
import User from "../models/User.Model.js";
import { resetPasswordMail } from "../services/Mails/ResetMail.js";

export const requestResetPassword = async (req, res) => {
  try {
    if (!req.body.email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: "This email does not exist" });
    }

    const token = crypto.randomBytes(16);
    user.resetPasswordToken = token;
    await user.save();

    await resetPasswordMail({
      email: user.email,
      name: user.name,
      token: token.toString("hex"),
    });

    res.status(200).send({ message: "Email sent successfully" });
  } catch (error) {
    res.status(500).send({ message: "Email not sent" });
  }
};
