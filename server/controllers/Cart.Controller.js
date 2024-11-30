import Cart from "../models/Cart.Model.js";

export const fetchCartByUserId = async (req, res) => {
  const userId = req.params.id;
  try {
    const cartItem = await Cart.find({ user: userId }).populate("product");
    res.status(200).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const cart = await Cart.create(req.body);
    await cart.save();
    const data = await cart.populate("product");
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteItemFromCart = async (req, res) => {
  const id = req.params.id;
  try {
    const cart = await Cart.findByIdAndDelete(id);
    res.status(201).json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateCart = async (req, res) => {
  const id = req.params.id;
  try {
    const cart = await Cart.findByIdAndUpdate(id, req.body, { new: true });
    await cart.save();
    const data = await cart.populate("product");
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
