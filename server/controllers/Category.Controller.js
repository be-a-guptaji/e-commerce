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
    const category = await Category.create(req.body);
    await category.save();
    return res.status(201).json(category);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
