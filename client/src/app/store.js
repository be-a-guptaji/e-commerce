import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/product/productSlice";
import authReducer from "../features/auth/authSlice";
import cartReducer from "../features/cart/cartSlice";
import orderReducer from "../features/order/orderSlice";
import userReducer from "../features/user/userSlice";
import paymentReducer from "../features/payment/paymentSlice";
import brandReducer from "../features/brands/brandSlice";
import categoryReducer from "../features/category/categorySlice";

export const store = configureStore({
  reducer: {
    product: productReducer,
    auth: authReducer,
    cart: cartReducer,
    order: orderReducer,
    user: userReducer,
    payment: paymentReducer,
    brand: brandReducer,
    category: categoryReducer,
  },
});
