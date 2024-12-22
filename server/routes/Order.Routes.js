import express from "express";
import {
  creaetOrder,
  deleteOrder,
  fetchAllOrders,
  fetchOrdersByUser,
  updateOrder,
} from "../controllers/Order.Controller.js";

const router = express.Router();

router.post("/", creaetOrder);
router.get("/owner/:queryString", fetchOrdersByUser);
router.get("/admin/:queryString", fetchAllOrders);
router.delete("/:id", deleteOrder);
router.patch("/:id", updateOrder);

export default router;
