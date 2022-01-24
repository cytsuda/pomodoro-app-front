import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: ControlType = {
  token: undefined,
  user: undefined,
}

export const userSlice = createSlice({
  name: 'control',
  initialState,
  reducers: {
    getUser: (state: ControlType, action: PayloadAction<ControlType>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    startLogin: (state: ControlType, action: PayloadAction<ControlType>) => {
      state.token = action.payload.token;
      state.user = action.payload.user
    },
  },
})

// Action creators are generated for each case reducer function
export const { startLogin, getUser } = userSlice.actions

export default userSlice.reducer