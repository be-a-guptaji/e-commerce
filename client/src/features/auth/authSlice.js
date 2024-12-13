import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { logginUser, createUser, signOut, checkAuth } from "./authAPI";

const initialState = {
  loggedInUserToken: null,
  status: "idle",
  error: null,
  userChecked: false,
};

export const createUserAsync = createAsyncThunk(
  "user/createUser",
  async (userData) => {
    const response = await createUser(userData);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const logginUserAsync = createAsyncThunk(
  "user/logginUser",
  async (loginInfo) => {
    const response = await logginUser(loginInfo);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const checkAuthAsync = createAsyncThunk(
  "user/checkAuth",
  async (loginInfo) => {
    const response = await checkAuth();
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const signOutAsync = createAsyncThunk(
  "user/signOut",
  async (loginInfo) => {
    const response = await signOut(loginInfo);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUserError: (state) => {
      state.error = null;
    },
    resetUser: (state) => {
      state.loggedInUserToken = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createUserAsync.fulfilled, (state) => {
        state.status = "idle";
        state.loggedInUserToken = {};
      })
      .addCase(createUserAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.error;
      })
      .addCase(logginUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logginUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.loggedInUserToken = action.payload;
      })
      .addCase(logginUserAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.error;
      })
      .addCase(checkAuthAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkAuthAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.loggedInUserToken = action.payload;
        state.userChecked = true;
      })
      .addCase(checkAuthAsync.rejected, (state, action) => {
        state.status = "idle";
        state.userChecked = true;
      })
      .addCase(signOutAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signOutAsync.fulfilled, (state) => {
        state.status = "idle";
        state.loggedInUserToken = null;
      });
  },
});

export const { resetUserError } = authSlice.actions;

export const { resetUser } = authSlice.actions;

export const selectLoggedInUser = (state) => state.auth.loggedInUserToken;

export const selectAuthError = (state) => state.auth.error;

export const selectUserChecked = (state) => state.auth.userChecked;

export default authSlice.reducer;
