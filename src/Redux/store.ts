import { configureStore } from '@reduxjs/toolkit'
import timerReducer from "@/Redux/timerReducer";

export const store = configureStore({
  reducer: {
    timer: timerReducer
  },
})
