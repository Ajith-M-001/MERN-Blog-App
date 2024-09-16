import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  CurrentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      console.log("signInSuccess payload:", action.payload);
      state.loading = false;
      state.CurrentUser = action.payload;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { signInStart, signInSuccess, signInFailure } = userSlice.actions;

export default userSlice.reducer;
