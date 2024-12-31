import express from "express";
import {
  deleteOrder,
  fetchAllOrders,
  fetchOrdersByUser,
  updateOrder,
  createOrder,
} from "../controllers/Order.Controller.js";

const router = express.Router();

router.post("/", createOrder);
router.patch("/:id", updateOrder);
router.get("/owner/:queryString", fetchOrdersByUser);
router.get("/admin/:queryString", fetchAllOrders);
router.delete("/:id", deleteOrder);

export default router;
