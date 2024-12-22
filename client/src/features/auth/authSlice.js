import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  logginUser,
  createUser,
  signOut,
  checkAuth,
  requestResetPassword,
  resetPassword,
} from "./authAPI";

const initialState = {
  loggedInUserToken: null,
  status: "idle",
  error: null,
  userChecked: false,
  mailSent: false,
  passwordResetStatus: false,
  signupDone: false,
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

export const checkAuthAsync = createAsyncThunk("user/checkAuth", async () => {
  const response = await checkAuth();
  // The value we return becomes the `fulfilled` action payload
  return response.data;
});

export const requestResetPasswordAsync = createAsyncThunk(
  "user/requestResetPassword",
  async (email) => {
    const response = await requestResetPassword(email);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const resetPasswordAsync = createAsyncThunk(
  "user/resetPassword",
  async (data) => {
    const response = await resetPassword(data);
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
    resetMailStatus: (state) => {
      state.mailSent = false;
    },
    resetPasswordResetStatus: (state) => {
      state.passwordResetStatus = false;
    },
    resetSignupDone: (state) => {
      state.signupDone = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createUserAsync.fulfilled, (state) => {
        state.status = "idle";
        state.signupDone = true;
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
      .addCase(checkAuthAsync.rejected, (state) => {
        state.status = "idle";
        state.userChecked = true;
      })
      .addCase(signOutAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signOutAsync.fulfilled, (state) => {
        state.status = "idle";
        state.loggedInUserToken = null;
      })
      .addCase(requestResetPasswordAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(requestResetPasswordAsync.fulfilled, (state) => {
        state.status = "idle";
        state.mailSent = true;
      })
      .addCase(requestResetPasswordAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.error;
      })
      .addCase(resetPasswordAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(resetPasswordAsync.fulfilled, (state) => {
        state.status = "idle";
        state.passwordResetStatus = true;
      })
      .addCase(resetPasswordAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.error;
      });
  },
});

export const { resetUserError } = authSlice.actions;

export const { resetUser } = authSlice.actions;

export const { resetMailStatus } = authSlice.actions;

export const { resetPasswordResetStatus } = authSlice.actions;

export const { resetSignupDone } = authSlice.actions;

export const selectLoggedInUser = (state) => state.auth.loggedInUserToken;

export const selectAuthError = (state) => state.auth.error;

export const selectUserChecked = (state) => state.auth.userChecked;

export const selectMailSent = (state) => state.auth.mailSent;

export const selectAuthStatus = (state) => state.auth.status;

export const selectSignupDone = (state) => state.auth.signupDone;

export const selectPasswordResetStatus = (state) =>
  state.auth.passwordResetStatus;

export default authSlice.reducer;
