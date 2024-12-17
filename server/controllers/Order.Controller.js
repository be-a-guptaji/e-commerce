import Order from "../models/Order.Model.js";
import Product from "../models/Product.Model.js";
import { createPayment } from "./Payment.Controller.js";

export const fetchOrdersByUser = async (req, res) => {
  const { id } = req.user;
  try {
    const orders = await Order.find({ user: id }).sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const creaetOrder = async (req, res) => {
  try {
    for (let product = 0; product < req.body.items.length; product++) {
      let item = await Product.findById(req.body.items[product].product.id);
      if (item.stock < req.body.items[product].quantity) {
        return res
          .status(404)
          .json({ message: `${item.title} has been Out of stock` });
      }
    }
    for (let product = 0; product < req.body.items.length; product++) {
      let item = await Product.findById(req.body.items[product].product.id);
      item.stock -= req.body.items[product].quantity;
      await item.save();
    }

    const payment = await createPayment({
      paymentMethod: "cash",
      paymentID: "Pay On Delivery",
      done: false,
    });

    const order = await Order.create({ ...req.body, payment });
    await order.save();

    return res.status(201).json(order);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  const id = req.params.id;
  try {
    const order = await Order.findByIdAndDelete(id);
    return res.status(201).json(order);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateOrder = async (req, res) => {
  const id = req.params.id;
  try {
    const order = await Order.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(201).json(order);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const fetchAllOrders = async (req, res) => {
  const queryString = req.params.queryString;
  const parts = queryString.split("&");
  let filter = [];
  try {
    for (let part of parts) {
      const [key, value] = part.split("=");
      filter.push({ [key]: value });
    }

    if (filter[0]["_sort"] === "id") {
      filter[0]["_sort"] = "_id";
    }

    const pageSize = parseInt(filter[3]["_per_page"]) || 12;
    const page = parseInt(filter[2]["_page"]) || 1;

    if (filter[1]["_order"] === "asc") {
      filter[1]["_order"] = 1;
    } else {
      filter[1]["_order"] = -1;
    }

    let totalOrderQuery = Order.find().sort({
      [filter[0]["_sort"]]: filter[1]["_order"],
    });

    const totalOrders = await Order.countDocuments(totalOrderQuery.getQuery());

    totalOrderQuery = totalOrderQuery
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const products = await totalOrderQuery.exec();

    const totalPages = Math.ceil(totalOrders / pageSize);

    return res.set("X-Total-Count", totalOrders);
    return res.status(200).json({
      products,
      totalOrders,
      totalPages,
      currentPage: page,
      pageSize,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error, could not retrieve products",
      error: error.message,
    });
  }
};
