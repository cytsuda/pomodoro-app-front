import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: ControlType = {
  token: null,
  user: null,
}

export const userSlice = createSlice({
  name: 'control',
  initialState,
  reducers: {
    startLogin: (state: ControlType, action: PayloadAction<ControlType>) => {
      state.token = action.payload.token;
      state.user = action.payload.user
    },
  },
})

// Action creators are generated for each case reducer function
export const { startLogin } = userSlice.actions

export default userSlice.reducer