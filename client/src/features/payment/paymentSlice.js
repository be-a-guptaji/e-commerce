import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { initiatePayment } from "./paymentAPI";

const initialState = {
  status: "idle",
  paymentSucess: false,
  paymentId: "",
  razorpayID: "",
  error: null,
};
//we may need more info of current payment

export const initiatePaymentAsync = createAsyncThunk(
  "payment/initiatePayment",
  async (data) => {
    const response = await initiatePayment(data);
    // The value we return becomes the `fulfilled` action payload
    return response;
  }
);

export const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    resetPayment: (state) => {
      state.paymentSucess = false;
      state.paymentId = "";
      state.razorpayID = "";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiatePaymentAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(initiatePaymentAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.paymentSucess = true;
        state.paymentId = action.payload.paymentId;
        state.razorpayID = action.payload.razorpayID;
      })
      .addCase(initiatePaymentAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.error;
      });
  },
});

export const { resetPayment } = paymentSlice.actions;

export const selectPaymentSuccess = (state) => state.payment.paymentSucess;

export const selectPaymentId = (state) => state.payment.paymentId;

export const selectRazorpayID = (state) => state.payment.razorpayID;

export const selectPaymentError = (state) => state.payment.error;

export default paymentSlice.reducer;
