import Order from "../models/Order.Model.js";
import Product from "../models/Product.Model.js";
import { createPayment } from "./Payment.Controller.js";
import { confirmationMail } from "../services/Mails/ConfirmationMail.js";

export const fetchOrdersByUser = async (req, res) => {
  try {
    const { id } = req.user;
    const queryString = req.params.queryString;
    const parts = queryString.split("&");
    let search = {};

    for (let part of parts) {
      search[part.split("=")[0]] = part.split("=")[1];
    }

    delete search[""];

    const pageSize = parseInt(search["_per_page"]) || 12;
    const page = parseInt(search["_page"]) || 1;

    let orders = await Order.find({ user: id })
      .populate("payment")
      .sort({ createdAt: -1 });

    let successOrders = [];

    for (let i = 0; i < orders.length; i++) {
      if (
        orders[i].payment.done ||
        orders[i].payment.paymentMethod === "cash"
      ) {
        successOrders.push(orders[i]);
      }
    }

    const totalOrders = successOrders.length;

    let order = [];
    let start = pageSize * (page - 1);
    let end = Math.min(start + pageSize, successOrders.length);

    for (let i = start; i < end; i++) {
      order.push(successOrders[i]);
    }

    const totalPages = Math.ceil(totalOrders / pageSize);

    return res.status(200).json({
      orders: order,
      totalOrders,
      totalPages,
      currentPage: page,
      pageSize,
    });
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

    const fullOrder = await order.populate("payment");

    confirmationMail({ email: req.user.email, order: fullOrder });

    return res.status(201).json(order);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const id = req.params.id;

    const order = await Order.findByIdAndDelete(id);

    return res.status(201).json(order);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const id = req.params.id;

    const order = await Order.findById(id).populate("payment");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = req.body.status;
    await order.save();

    return res.status(200).json(order);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const fetchAllOrders = async (req, res) => {
  try {
    const queryString = req.params.queryString;
    const parts = queryString.split("&");
    let search = {};

    for (let part of parts) {
      search[part.split("=")[0]] = part.split("=")[1];
    }

    delete search[""];

    if (search["_sort"] === "id") {
      search["_sort"] = "_id";
    }

    const pageSize = parseInt(search["_per_page"]) || 12;
    const page = parseInt(search["_page"]) || 1;

    if (search["_order"] === "asc") {
      search["_order"] = 1;
    } else {
      search["_order"] = -1;
    }

    let orders = await Order.find()
      .populate("payment")
      .sort({
        [search["_sort"]]: search["_order"],
      });

    let successOrders = [];

    for (let i = 0; i < orders.length; i++) {
      if (
        orders[i].payment.done ||
        orders[i].payment.paymentMethod === "cash"
      ) {
        successOrders.push(orders[i]);
      }
    }

    const totalOrders = successOrders.length;

    let order = [];
    let start = pageSize * (page - 1);
    let end = Math.min(start + pageSize, successOrders.length);

    for (let i = start; i < end; i++) {
      order.push(successOrders[i]);
    }

    const totalPages = Math.ceil(totalOrders / pageSize);

    res.set("X-Total-Count", totalOrders);
    return res.status(200).json({
      products: order,
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
