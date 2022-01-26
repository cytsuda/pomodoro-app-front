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
    countdownChange: (state, action: PayloadAction<number>) => {
      state.percent = action.payload;
    },
    countdownStart: (state, action: PayloadAction<CountdownStart>) => {
      console.log("[SET COUNTDOWN] - START");
      console.log(action.payload.pomo);
      console.log("[SET COUNTDOWN] - END");
      state.active = true;
      state.timer = action.payload.timer;
      state.pomo = action.payload.pomo;
    },
    countdownStop: (state) => {
      state.active = false;
      console.log("Contdown stop need to send cancel request to backend")
    },
    countdownSet: (state, action: PayloadAction<CountdownType | undefined | null>) => {
      if (action.payload) {
        state = action.payload;
      } else {
        state = initialState;
      }
    }
  },
})

// Action creators are generated for each case reducer function
export const {
  countdownChange,
  countdownStart,
  countdownStop,
  countdownSet
} = timerSlice.actions

export default timerSlice.reducer