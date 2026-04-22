import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser, LoginResponse } from "../api/authApi";

interface AuthState {
  accessToken:  string | null;
  refreshToken: string | null;
  user:         AuthUser | null;
}

const initialState: AuthState = {
  accessToken:  localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  user:         JSON.parse(localStorage.getItem("user") ?? "null"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, { payload }: PayloadAction<LoginResponse>) {
      state.accessToken  = payload.accessToken;
      state.refreshToken = payload.refreshToken;
      state.user         = payload.user;
      localStorage.setItem("accessToken",  payload.accessToken);
      localStorage.setItem("refreshToken", payload.refreshToken);
      localStorage.setItem("user",         JSON.stringify(payload.user));
    },
    clearCredentials(state) {
      state.accessToken  = null;
      state.refreshToken = null;
      state.user         = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;