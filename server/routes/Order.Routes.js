import express from "express";
import {
  creaetOrder,
  deleteOrder,
  fetchOrdersByUserId,
  updateOrder,
} from "../controllers/Order.Controller.js";

const router = express.Router();

router.post("/", creaetOrder);
router.get("/", fetchOrdersByUserId);
router.delete("/:id", deleteOrder);
router.patch("/:id", updateOrder);

export default router;
