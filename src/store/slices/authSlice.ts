import { createSlice } from "@reduxjs/toolkit";

interface initialState {
  address: string | null;
  isAuthenticated: boolean;
}

const initialState: initialState = {
  address: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.address = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.address = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
