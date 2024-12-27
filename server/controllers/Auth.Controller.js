import User from "../models/User.Model.js";
import crypto from "crypto";
import { resetPasswordMail } from "../services/Mails/ResetMail.js";
import { welcomeMail } from "../services/Mails/WelcomMail.js";

export const createUser = async (req, res) => {
  try {
    let user;

    user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(401).json({ message: "Email already exists" });
    }

    const salt = crypto.randomBytes(16);

    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error while hashing password" });
        }

        req.body.password = hashedPassword;
        req.body.salt = salt;

        try {
          user = await User.create(req.body);
          await user.save();

          welcomeMail({ email: user.email, name: user.name });

          return res.status(201).json({ message: "User created successfully" });
        } catch (error) {
          return res.status(400).json({ message: error.message });
        }
      }
    );
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    res
      .cookie("jwt", req.user.token, {
        expires: new Date(Date.now() + 86400000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
      })
      .status(201)
      .json({ token: req.user.token });
  } catch (error) {
    if (!res.headersSent) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

export const checkAuth = async (req, res) => {
  if (req.user) {
    return res.status(201).json(req.user);
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    return res
      .cookie("jwt", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
      })
      .status(201)
      .json({ message: "User logged out successfully" });
  } catch (error) {
    if (!res.headersSent) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, token, password } = req.body;

    if (!email || !token || !password) {
      return res
        .status(400)
        .json({ message: "Email, token and password are required" });
    }

    const buffer = Buffer.from(token, "hex");

    const user = await User.findOne({
      email: email,
      resetPasswordToken: buffer,
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "The Link is either invalid or expired" });
    }

    const salt = crypto.randomBytes(16);

    crypto.pbkdf2(
      password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error while hashing password" });
        }

        req.body.password = hashedPassword;
        req.body.salt = salt;
        req.body.resetPasswordToken = null;

        try {
          await User.updateOne({ email: email }, req.body);

          resetPasswordMail({ email: user.email, name: user.name });

          return res
            .status(201)
            .json({ message: "Password reset successfully" });
        } catch (error) {
          return res.status(400).json({ message: error.message });
        }
      }
    );
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
