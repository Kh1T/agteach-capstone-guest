import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  isVerified : false,
  isAtCart: false,
  isAtCourseDetail: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    checkLoginStatus: (state, action) => {
      const { isAuthenticated, isVerified } = action.payload;
      state.isAuthenticated = isAuthenticated;
      state.isVerified = isVerified;
    },

    isAtCart: (state, action) => {
      state.isAtCart = action.payload;
    },

    isAtCourseDetail: (state, action) => {
      state.isAtCourseDetail = action.payload;
    },
  },
});

export const { checkLoginStatus, isAtCart, isAtCourseDetail } = authSlice.actions;
export default authSlice.reducer;
