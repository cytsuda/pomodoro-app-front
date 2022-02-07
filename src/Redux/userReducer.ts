import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: ControlType = {
  token: undefined,
  user: undefined,
  pomoConfig: {
    id: "0",
    longBreakDuration: 15,
    shortBreakDuration: 5,
    workDuration: 25,
    pomoBeforeLongBreak: 4,
  }
}
type UserToken = { token: string, user: UserType }

export const userSlice = createSlice({
  name: 'control',
  initialState,
  reducers: {
    getUser: (state: ControlType, action: PayloadAction<UserToken>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    startLogin: (state: ControlType, action: PayloadAction<UserToken>) => {
      state.token = action.payload.token;
      state.user = action.payload.user
    },
    setPomoConfig: (state: ControlType, action: PayloadAction<PomoConfigType>) => {
      state.pomoConfig = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { startLogin, getUser, setPomoConfig } = userSlice.actions

export default userSlice.reducer