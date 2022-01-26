import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: PomoControlType = {
  loading: false,
  pomos: []
}

export const pomoSlicer = createSlice({
  name: 'pomo',
  initialState,
  reducers: {
    getPomos: (state, action: PayloadAction<PomoType[] | undefined>) => {
      if (action.payload) {
        state.pomos = action.payload;
      } else {
        state.pomos = initialState.pomos;
      }
    }
  },
})

// Action creators are generated for each case reducer function
export const { getPomos
} = pomoSlicer.actions

export default pomoSlicer.reducer