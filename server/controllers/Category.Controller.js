import Category from "../models/Category.Model.js";

export const fetchCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    let data = {};

    data.label = req.body.label
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    data.value = req.body.value
      .split(" ")
      .map((word) => word.charAt(0).toLowerCase() + word.slice(1).toLowerCase())
      .join(" ");

    const categories = await Category.create(data);

    await categories.save();

    return res.status(201).json(categories);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
