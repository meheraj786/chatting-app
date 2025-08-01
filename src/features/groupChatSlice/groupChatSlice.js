import { createSlice } from "@reduxjs/toolkit";


export const groupChatSlice= createSlice({
  name: "groupChat",
  initialState: {
    value: localStorage.getItem("groupChat") ? JSON.parse(localStorage.getItem("groupChat")) : null
  },
  reducers:{
    groupChat: (state,action)=>{
      state.value= action.payload
      localStorage.setItem("groupChat", JSON.stringify(action.payload))
    }
  }
})

export default groupChatSlice.reducer
export const {groupChat}= groupChatSlice.actions