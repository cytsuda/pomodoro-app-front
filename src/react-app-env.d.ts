/// <reference types="react-scripts" />

// Infer the `RootState` and `AppDispatch` types from the store itself
type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
type AppDispatch = typeof store.dispatch
declare module "*.module.less" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

type TimerType = {
  active: boolean,
  percent: number,
  timer: number | string | undefined
}

type PomoType = {
  workDuration: number,
  shortBreakDuration: number,
  longBreakDuration: number,
  pomoBeforeLongBreak: number
}

