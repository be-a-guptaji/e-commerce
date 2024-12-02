import Order from "../models/Order.Model.js";

export const fetchOrdersByUserId = async (req, res) => {
  const userId = req.params.id;
  try {
    const orders = await Order.find({ user: userId });
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

export const fetchAllOrders = async (req, res) => {
  const queryString = req.params;
  const parts = queryString.queryString.split("&");
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

    res.set("X-Total-Count", totalOrders);
    res.status(200).json({
      products,
      totalOrders,
      totalPages,
      currentPage: page,
      pageSize,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      message: "Internal server error, could not retrieve products",
      error: error.message,
    });
  }
};
