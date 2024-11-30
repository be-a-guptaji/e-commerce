import User from "../models/User.Model.js";

export const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    await user.save();

    const userObject = user.toObject();

    const id = userObject._id;
    userObject.id = id;

    delete userObject.password;
    delete userObject._id;

    if (!userObject.addresses) {
      userObject["addresses"] = [];
    }

    return res.status(201).json(userObject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const user = await User.findOne(
      { email: req.body.email },
      "id name email password role addresses"
    );

    if (!user) {
      return res.status(404).json({ message: "wrong credentials" });
    }

    if (user.password !== req.body.password) {
      return res.status(401).json({ message: "wrong credentials" });
    } else {
      const userObject = user.toObject();

      const id = userObject._id;
      userObject.id = id;

      delete userObject.password;
      delete userObject._id;

      if (!userObject.addresses) {
        userObject["addresses"] = [];
      }

      return res.status(201).json(userObject);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
