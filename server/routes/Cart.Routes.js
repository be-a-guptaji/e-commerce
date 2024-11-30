import express from "express";
import {
  addToCart,
  deleteItemFromCart,
  fetchCartByUserId,
  updateCart,
} from "../controllers/Cart.Controller.js";

const router = express.Router();

router.post("/", addToCart);
router.get("/:id", fetchCartByUserId);
router.delete("/:id", deleteItemFromCart);
router.patch("/:id", updateCart);

export default router;
