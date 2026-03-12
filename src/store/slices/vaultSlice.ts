import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface VaultState {
  userBalance: string; // in vault (ETH)
  totalDeposits: string; // in vault (ETH)
  walletBalance: string; // in wallet (ETH)
}

const initialState: VaultState = {
  userBalance: "0",
  totalDeposits: "0",
  walletBalance: "0",
};

const vaultSlice = createSlice({
  name: "vault",
  initialState,
  reducers: {
    setVaultData(
      state,
      action: PayloadAction<{
        userBalance: string;
        totalDeposits: string;
        walletBalance: string;
      }>,
    ) {
      state.userBalance = action.payload.userBalance;
      state.totalDeposits = action.payload.totalDeposits;
      state.walletBalance = action.payload.walletBalance;
    },
    resetVault() {
      return initialState;
    },
  },
});

export const { setVaultData, resetVault } = vaultSlice.actions;
export default vaultSlice.reducer;
