import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import vaultReducer from "./slices/vaultSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    vault: vaultReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
