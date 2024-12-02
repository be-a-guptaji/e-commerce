import express from "express";
import {
  creaetOrder,
  deleteOrder,
  fetchAllOrders,
  fetchOrdersByUserId,
  updateOrder,
} from "../controllers/Order.Controller.js";

const router = express.Router();

router.post("/", creaetOrder);
router.get("/:id", fetchOrdersByUserId);
router.get("/admin/:queryString", fetchAllOrders);
router.delete("/:id", deleteOrder);
router.patch("/:id", updateOrder); 

export default router;
