import User from "../models/User.Model.js";
import crypto from "crypto";

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

        let userObject = req.body;

        userObject["name"] = userObject.email.split("@")[0];

        try {
          user = await User.create(userObject);
          await user.save();

          return res.status(201).json({ message: "User created successfully" });
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
      }
    );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  res
    .cookie("jwt", req.user.token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    })
    .status(201)
    .json(req.user.token);
};

export const checkAuth = async (req, res) => {
  if (req.user) {
    res.status(201).json(req.user);
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};
