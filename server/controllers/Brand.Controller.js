import Brand from "../models/Brand.Model.js";

export const fetchBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    return res.status(200).json(brands);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createBrand = async (req, res) => {
  try {
    const brand = await Brand.create(req.body);
    await brand.save();
    return res.status(201).json(brand);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
