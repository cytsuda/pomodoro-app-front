import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: CountdownType = {
  active: false,
  percent: 0,
  timer: 0,
  pomo: undefined,
}

type CountdownStart = {
  pomo: PomoType;
  timer: number | string | undefined
}
export const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {

    // Countdown Section
    percentChange: (state, action: PayloadAction<number>) => {
      state.percent = action.payload;
    },
    timerStart: (state, action: PayloadAction<CountdownStart>) => {
      state.active = true;
      state.timer = action.payload.timer;
      state.pomo = action.payload.pomo;
    },
    timerCancel: (state) => {
      state.active = false;
      console.log("Contdown stop need to send cancel request to backend")
    },
    timerFinish: () => {
      return initialState;
    }

  },
})

// Action creators are generated for each case reducer function
export const {
  percentChange,
  timerStart,
  timerCancel,
  timerFinish,
} = timerSlice.actions

export default timerSlice.reducer