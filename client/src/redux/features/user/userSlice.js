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
    updateStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateSuccess: (state, action) => {
      state.CurrentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteSuccess: (state) => {
      state.CurrentUser = null;
      state.loading = false;
      state.error = null;
    },

    deleteFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signOutSuccess: (state) => {
      state.CurrentUser = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateFailure,
  updateSuccess,
  updateStart,
  deleteFailure,
  deleteSuccess,
  deleteStart,
  signOutSuccess,
} = userSlice.actions;

export default userSlice.reducer;
