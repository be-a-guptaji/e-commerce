import express from "express";
import {
  createPaymentIntent,
  verifyPayment,
} from "../controllers/Payment.Controller.js";

const router = express.Router();

router.post("/initiate", createPaymentIntent);
router.post("/verify", verifyPayment);

export default router;
