import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: PomoControlType = {
  loading: false,
  pomos: [],
  total: 0
}
type SetPomosProps = {
  pomos: PomoType[];
  total: number;
}
export const pomoSlicer = createSlice({
  name: 'pomo',
  initialState,
  reducers: {
    setPomos: (state: PomoControlType, action: PayloadAction<SetPomosProps>) => {
      if (action.payload) {
        state.pomos = action.payload.pomos;
        state.total = action.payload.total;
      } else {
        state.pomos = initialState.pomos;
      }
    },

  },
})

// Action creators are generated for each case reducer function
export const {
  setPomos,
} = pomoSlicer.actions

export default pomoSlicer.reducer