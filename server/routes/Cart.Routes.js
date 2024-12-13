import express from "express";
import {
  addToCart,
  deleteItemFromCart,
  fetchCartByUser,
  updateCart,
} from "../controllers/Cart.Controller.js";

const router = express.Router();

router.post("/", addToCart);
router.get("/", fetchCartByUser);
router.delete("/:id", deleteItemFromCart);
router.patch("/:id", updateCart);

export default router;
