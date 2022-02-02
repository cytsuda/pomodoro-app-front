import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: CountdownType = {
  end: Date.now(),
  status: "waiting",
  type: "work"
}

type TimerStartPayload = {
  end: number;
  type: PomoWorkTypes;
}

export const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    timerStart: (state: CountdownType, action: PayloadAction<TimerStartPayload>) => {
      state.end = action.payload.end;
      state.status = "running";
      state.type = action.payload.type;
    },
    timerFinish: (state: CountdownType) => {
      state.status = "finish";
    },
    timerNext: (state: CountdownType, action: PayloadAction<PomoWorkTypes>) => {
      state.end = Date.now();
      state.status = "waiting";
      state.type = action.payload;
    },
  },
})
// status  "running" | "finish" | "pause" | "waiting"
// Action creators are generated for each case reducer function
export const {
  timerStart, timerFinish, timerNext
} = timerSlice.actions

export default timerSlice.reducer