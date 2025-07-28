import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../features/user/userSlice'
import roomReducer from "../features/chatRoom/chatRoom";

const store= configureStore({
  reducer:{
    userInfo: userReducer,
    roomUser: roomReducer,
  }
})

export default store