import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createBrand, fetchBrands } from "./brandsAPI";

const initialState = {
  status: "idle",
  brands: [],
  brandName: null,
  error: null,
};

export const fetchBrandsAsync = createAsyncThunk(
  "brands/fetchBrands",
  async () => {
    const response = await fetchBrands();
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const createBrandAsync = createAsyncThunk(
  "brands/createBrand",
  async (brand, { getState }) => {
    const state = getState();
    const brandName = state.brand.brandName;

    const response = await createBrand({ label: brandName, value: brandName });
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {
    setBrandName: (state, action) => {
      state.brandName = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchBrandsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBrandsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.brands = action.payload;
      })
      .addCase(createBrandAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createBrandAsync.fulfilled, (state, action) => {
        state.status = "idle";
        try {
          state.brands.push(action.payload);
        } catch (error) {
          console.error(error);
        }
      });
  },
});

export const { setBrandName } = brandSlice.actions;

export const selectBrands = (state) => state.brand.brands;

export default brandSlice.reducer;
