import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "../models/Payment.Model.js";
import Product from "../models/Product.Model.js";
import Order from "../models/Order.Model.js";
import { confirmationMail } from "../services/Mails/ConfirmationMail.js";

export const createPayment = async ({ paymentMethod, paymentID, done }) => {
  try {
    const payment = await Payment.create({
      paymentMethod,
      paymentID,
      done,
    });
    await payment.save();

    return payment._id;
  } catch (error) {
    return null;
  }
};

export const createPaymentIntent = async (req, res) => {
  try {
    // Create Razorpay instance
    let instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    // Prepare options for the order
    let options = {
      amount: Number.parseFloat(req.body.totalAmount) * 100, // Amount in paise
      currency: "INR", // Currency (INR for Indian Rupee)
    };

    // Create an order using Razorpay API
    let CreateOrder = await instance.orders.create(options);

    // Create a payment record in the database with status "pending"

    let items = [];

    for (let product of req.body.items) {
      const productId = product.product.id.toString();
      const quantity = product.quantity;
      const existingItem = items.find((item) => item.id === productId);

      if (existingItem) {
        existingItem.stock += quantity;
      } else {
        items.push({
          id: productId,
          stock: quantity,
        });
      }
    }

    for (let product = 0; product < items.length; product++) {
      let item = await Product.findById(items[product].id);

      if (item.stock < items[product].stock) {
        return res
          .status(404)
          .json({ message: `${item.title} has been Out of stock` });
      }
    }

    for (let product = 0; product < items.length; product++) {
      let item = await Product.findById(items[product].id);
      item.stock -= items[product].stock;
      await item.save();
    }
    const payment = await createPayment({
      paymentMethod: req.body.paymentMethod,
      paymentID: CreateOrder.id,
      done: false,
    });

    const order = await Order.create({ ...req.body, payment });

    await order.save();

    const fullOrder = await order.populate("payment");

    confirmationMail({
      email: req.user.email,
      order: order,
    });

    // Return the Razorpay order ID for client-side use
    return res.status(201).json({
      paymentId: CreateOrder.id,
      razorpayID: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to initiate payment" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    // Parse JSON body (if you're sending JSON)
    // If your client sends JSON data (with 'Content-Type: application/json'), uncomment this:
    const body = req.body;

    // If you're using 'form-data' or 'x-www-form-urlencoded', uncomment this:
    // const body = await req.formData();
    // body = Object.fromEntries(body);

    // 1. Fetch order details from the database
    const payment = await Payment.findOne({
      paymentID: body.razorpay_order_id,
    });

    if (!payment) {
      return res.status(400).json({ message: "Order not found" });
    }

    // 2. Validate payment signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.razorpay_order_id + "|" + body.razorpay_payment_id)
      .digest("hex");

    // 3. Check if the generated signature matches the received signature
    const isValid = generatedSignature === body.razorpay_signature;

    if (isValid) {
      // 4. Update the order as "done" after successful payment verification
      const updatedPayment = await Payment.findByIdAndUpdate(
        payment._id, // Condition to find the document by Razorpay Order ID
        { done: true }, // Update the `done` field to `true`
        { new: true } // Return the updated document (instead of the original)
      );

      const order = await Order.findOne({ payment: updatedPayment._id });

      return res.redirect(
        `${process.env.CLIENT_URL}/order-success/${order._id}`
      );
    } else {
      // 5. If signature validation fails
      return res.status(400).json({ message: "Payment verification failed" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
