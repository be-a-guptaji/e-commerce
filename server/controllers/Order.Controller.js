import Order from "../models/Order.Model.js";

export const fetchOrdersByUserId = async (req, res) => {
  const userId = req.params.id;
  try {
    const orders = await Order.find({ user: userId }).populate("product");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const creaetOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  const id = req.params.id;
  try {
    const order = await Order.findByIdAndDelete(id);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateOrder = async (req, res) => {
  const id = req.params.id;
  try {
    const order = await Order.findByIdAndUpdate(id, req.body, { new: true });
    await order.save();
    const data = await order.populate("product");
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
