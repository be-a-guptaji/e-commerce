import Cart from "../models/Cart.Model.js";

export const fetchCartByUser = async (req, res) => {
  const { id } = req.user;
  try {
    const cartItem = await Cart.find({ user: id }).populate("product");
    return res.status(200).json(cartItem);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const addToCart = async (req, res) => {
  const { id } = req.user;
  try {
    const cart = await Cart.create({ ...req.body, user: id });
    await cart.save();
    const data = await cart.populate("product");
    return res.status(201).json(data);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteItemFromCart = async (req, res) => {
  const id = req.params.id;
  try {
    const cart = await Cart.findByIdAndDelete(id);
    return res.status(201).json(cart);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateCart = async (req, res) => {
  const id = req.params.id;
  try {
    const cart = await Cart.findByIdAndUpdate(id, req.body, { new: true });
    await cart.save();
    const data = await cart.populate("product");
    return res.status(201).json(data);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
