import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/connectDB.js";
import ProductRouter from "./routes/Product.Routes.js";
import BrandRouter from "./routes/Brand.Routes.js";
import CategoryRouter from "./routes/Category.Routes.js";
import UserRouter from "./routes/User.Routes.js";
import AuthRouter from "./routes/Auth.Routes.js";
import CartRouter from "./routes/Cart.Routes.js";
import OrderRouter from "./routes/Order.Routes.js";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

app.use("/products", ProductRouter);
app.use("/brands", BrandRouter);
app.use("/category", CategoryRouter);
app.use("/users", UserRouter);
app.use("/auth", AuthRouter);
app.use("/cart", CartRouter);
app.use("/orders", OrderRouter);

connectDB();

app.get("/", (req, res) => {
  res.json({ status: 200, message: "Hello World!" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});