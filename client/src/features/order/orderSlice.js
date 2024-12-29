import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createOrder, fetchAllOrder, updateOrder } from "./orderAPI";

const initialState = {
  orders: [],
  status: "idle",
  currentOrder: null,
  error: null,
  totalOrders: 0,
  viewOrder: null,
};
//we may need more info of current order

export const createOrderAsync = createAsyncThunk(
  "order/createOrder",
  async (order) => {
    const response = await createOrder(order);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const updateOrderAsync = createAsyncThunk(
  "order/updateOrder",
  async (order) => {
    const response = await updateOrder(order);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const fetchAllOrderAsync = createAsyncThunk(
  "order/fetchAllOrders",
  async ({ sort, pagination }) => {
    const response = await fetchAllOrder(sort, pagination);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.currentOrder = null;
    },
    resetStockError: (state) => {
      state.error = null;
    },
    setViewOrder: (state, action) => {
      state.viewOrder = action.payload;
    },
    resetViewOrder: (state) => {
      state.viewOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createOrderAsync.fulfilled, (state, action) => {
        state.status = "idle";
        try {
          state.orders.push(action.payload);
        } catch (error) {
          console.error(error);
        }
        state.currentOrder = action.payload;
      })
      .addCase(createOrderAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.error;
      })
      .addCase(fetchAllOrderAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllOrderAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.orders = action.payload.orders;
        state.totalOrders = action.payload.totalOrders;
      })
      .addCase(updateOrderAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateOrderAsync.fulfilled, (state, action) => {
        state.status = "idle";
        let index = state.orders.findIndex(
          (order) => order.id === action.payload.id
        );
        state.orders[index] = action.payload;
        state.viewOrder = action.payload;
      });
  },
});

export const { resetOrder } = orderSlice.actions;

export const { resetStockError } = orderSlice.actions;

export const { setViewOrder } = orderSlice.actions;

export const { resetViewOrder } = orderSlice.actions;

export const selectCurrentOrder = (state) => state.order.currentOrder;

export const selectOrders = (state) => state.order.orders;

export const selectTotalOrders = (state) => state.order.totalOrders;

export const selectStockError = (state) => state.order.error;

export const selectViewOrder = (state) => state.order.viewOrder;

export default orderSlice.reducer;
