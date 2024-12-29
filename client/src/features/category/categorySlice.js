import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createCategory, fetchCategories } from "./categoryAPI";

const initialState = {
  status: "idle",
  categories: [],
  categoryName: null,
  error: null,
};

export const fetchCategoriesAsync = createAsyncThunk(
  "category/fetchCategories",
  async () => {
    const response = await fetchCategories();
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const createCategoryAsync = createAsyncThunk(
  "category/createCategory",
  async (category, { getState }) => {
    const state = getState();
    const categoryName = state.category.categoryName;

    const response = await createCategory({
      label: categoryName,
      value: categoryName,
    });
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategoryName: (state, action) => {
      state.categoryName = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchCategoriesAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategoriesAsync.fulfilled, (state, action) => {
        state.status = "idle";
          state.categories = action.payload;
      })
      .addCase(createCategoryAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createCategoryAsync.fulfilled, (state, action) => {
        state.status = "idle";
        try {
          state.categories.push(action.payload);
        } catch (error) {
          console.error(error);
        }
      });
  },
});

export const { setCategoryName } = categorySlice.actions;

export const selectCategories = (state) => state.category.categories;

export default categorySlice.reducer;
