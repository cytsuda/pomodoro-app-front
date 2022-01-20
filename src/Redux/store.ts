import { configureStore } from '@reduxjs/toolkit'
import timerReducer from "@/Redux/timerReducer";
import userReducer from "@/Redux/userReducer";

export const store = configureStore({
  reducer: {
    timer: timerReducer,
    user: userReducer
  },
})
