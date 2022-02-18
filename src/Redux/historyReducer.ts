import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: HistoryType = {
  history: []
}


export const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    setHistory: (state: HistoryType, action: PayloadAction<MonthHistoryType>) => {
      const index = state.history.findIndex(hist => hist.month === action.payload.month)
      if (index === -1) {
        state.history.push(action.payload);
      } else {
        state.history[index].pomos = action.payload.pomos;
        state.history[index].dailyPomos = action.payload.dailyPomos;
        state.history[index].numDays = action.payload.numDays;
        state.history[index].weekPomos = action.payload.weekPomos;
        state.history[index].numWeeks = action.payload.numWeeks;
        state.history[index].monthPomos = action.payload.monthPomos;
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  setHistory
} = historySlice.actions

export default historySlice.reducer