import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: PomoType = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  pomoBeforeLongBreak: 4
}

export const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    changeWork: (state, action: PayloadAction<number>) => {
      state.workDuration = action.payload
    },
    changeShortBreak: (state, action: PayloadAction<number>) => {
      state.shortBreakDuration = action.payload
    },
    changeLongBreak: (state, action: PayloadAction<number>) => {
      state.longBreakDuration = action.payload
    },
    changeQntPomo: (state, action: PayloadAction<number>) => {
      state.pomoBeforeLongBreak = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { changeWork, changeShortBreak, changeLongBreak, changeQntPomo } = timerSlice.actions

export default timerSlice.reducer