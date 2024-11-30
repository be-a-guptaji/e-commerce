import User from "../models/User.Model.js";

export const fetchUserById = async (req, res) => {
  try {
    let user = await User.findById(req.params.id, "name email addresses role");
    if (user?.addresses.length === 0) {
      user["addresses"] = [];
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
