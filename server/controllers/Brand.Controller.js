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
    let data = {};

    for (let key in req.body) {
      data[key] = req.body[key]
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
    }

    const brands = await Brand.create(data);

    await brands.save();

    return res.status(201).json(brands);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
