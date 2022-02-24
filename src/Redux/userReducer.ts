import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: ControlType = {
  token: undefined,
  user: undefined,
  userConfig: {
    id: "0",
    pomoConfig: {
      longBreakDuration: 15,
      shortBreakDuration: 5,
      workDuration: 25,
      pomoBeforeLongBreak: 4,
    },
    goalsConfig: {
      daily: 8,
      weekly: 8 * 5,
      monthly: 8 * 5 * 4,
    },
    preferenceConfig: {
      sounds: {
        work: {
          title: "",
          url: ""
        },
        short: {
          title: "",
          url: ""
        },
        long: {
          title: "",
          url: ""
        },
      }
    }
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
    setPomoConfig: (state: ControlType, action: PayloadAction<UserConfigType>) => {
      state.userConfig.pomoConfig = action.payload.pomoConfig;
      state.userConfig.goalsConfig = action.payload.goalsConfig;
      state.userConfig.preferenceConfig = action.payload.preferenceConfig;
      state.userConfig.id = action.payload.id;
    },
    setPrefSoundConfig: (state: ControlType, action: PayloadAction<PreferenceSoundType>) => {
      state.userConfig.preferenceConfig.sounds = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { startLogin, getUser, setPomoConfig, setPrefSoundConfig } = userSlice.actions

export default userSlice.reducer