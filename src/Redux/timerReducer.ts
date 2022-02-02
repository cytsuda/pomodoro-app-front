import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: CountdownType = {
  end: Date.now(),
  status: "waiting",
  type: "work",
  pomoID: ""
}

type TimerStartPayload = {
  end: number;
  pomoID: string;
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
      state.pomoID = action.payload.pomoID;
    },
    timerRefresh: (state: CountdownType, action: PayloadAction<CountdownType>) => {
      state.end = action.payload.end;
      state.status = action.payload.status;
      state.type = action.payload.type;
      state.pomoID = action.payload.pomoID;
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
  timerStart, timerFinish, timerNext, timerRefresh
} = timerSlice.actions

export default timerSlice.reducer