import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import moment from 'moment'
/**
 * 
type HistoryType = {
  history: ScopeHistoryType[];
  currentHistory: CurrentHistoryType;
}


type ScopeHistoryType = {
  scope: string;
  data: ScopeHistoryDateType[];
}

type ScopeHistoryDateType = {
  day: string;
  week: string;
  pomos: PomoType[];
}

type CurrentHistoryType = {
  dailyPomos: number;
  weekPomos: number;
  monthPomos: number;
  totalDays: number;
  totalWeeks: number;
}
 * 
 */
const initialState: HistoryType = {
  history: [],
  currentHistory: {
    dailyPomos: 0,
    weekPomos: 0,
    monthPomos: 0,
    totalDays: 0,
    totalWeeks: 0,
  }
}

type SetHistoryType = {
  index: number,
  scope: string,
  data: ScopeHistoryDateType[]
  currentHistory?: CurrentHistoryType
}

export const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    setHistory: (state: HistoryType, action: PayloadAction<SetHistoryType>) => {
      state.history[action.payload.index] = {
        data: action.payload.data,
        scope: action.payload.scope
      }
      if (action.payload.currentHistory && action.payload.scope ===  moment().format("YYYY-MM")) {
        state.currentHistory = action.payload.currentHistory
      }

    },
  },
})

// Action creators are generated for each case reducer function
export const {
  setHistory
} = historySlice.actions

export default historySlice.reducer