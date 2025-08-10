import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    value: localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null,
  },
  reducers: {
    userInfo: (state, action) => {
      state.value = action.payload;
    },
    updateUserName: (state, action) => {
      if (state.value) {
        state.value.displayName = action.payload;
        localStorage.setItem("userInfo", JSON.stringify(state.value));
      }
    },
    updateUserStatus: (state, action) => {
      if (state.value) {
        state.value.status = action.payload;
        localStorage.setItem("userInfo", JSON.stringify(state.value));
      }
    },
  },
});

export default userSlice.reducer;
export const { userInfo, updateUserName, updateUserStatus } = userSlice.actions;
