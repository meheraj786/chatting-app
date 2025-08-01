import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../features/user/userSlice'
import roomReducer from "../features/chatRoom/chatRoom";
import  groupChatReducer  from "../features/groupChatSlice/groupChatSlice";

const store= configureStore({
  reducer:{
    userInfo: userReducer,
    roomUser: roomReducer,
    groupChat: groupChatReducer
  }
})

export default store