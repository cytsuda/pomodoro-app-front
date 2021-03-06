import { configureStore } from '@reduxjs/toolkit'
import timerReducer from "@/Redux/timerReducer";
import userReducer from "@/Redux/userReducer";
import taskReducer from "@/Redux/taskReducer";
import pomoReducer from "@/Redux/pomosReducers";
import historyReducer from "@/Redux/historyReducer";

export const store = configureStore({
  reducer: {
    task: taskReducer,
    timer: timerReducer,
    user: userReducer,
    pomo: pomoReducer,
    history: historyReducer
  },
})
