import { createSlice } from "@reduxjs/toolkit";


export const userSlice= createSlice({
  name: "user",
  initialState: {
    value: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null
  },
  reducers:{
    userInfo: (state,action)=>{
      state.value= action.payload
    }
  }
})

export default userSlice.reducer
export const {userInfo}= userSlice.actions