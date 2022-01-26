/// <reference types="react-scripts" />

// Infer the `RootState` and `AppDispatch` types from the store itself
type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
type AppDispatch = typeof store.dispatch

declare module 'moment' { export = moment; }

declare module "*.module.less" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

type ControlType = {
  token?: string;
  user?: UserType;
}
type UserType = {
  blocked: boolean;
  confirmed: boolean;
  createdAt: Date;
  email: string;
  id: number;
  provider: string;
  updatedAt: Date;
  username: string;
  pomoConfig: PomoConfigType | undefined;
}

// Timer, Countodown & Pomoconfig
type CountdownType = {
  active: boolean;
  percent: number;
  timer: number | string | undefined;
  pomo: PomoType | undefined;
}

type PomoConfigType = {
  workDuration: number,
  shortBreakDuration: number,
  longBreakDuration: number,
  pomoBeforeLongBreak: number,
}


type PomoControlType = {
  pomos: PomoType[];
  loading: boolean;
}

type PomoType = {
  id: string,
  attributes: {
    start: Date,
    end: Date,
    tasks: FetchedTaskType[],
    status: "running" | "completed" | "canceled" | "pause",
    remain: number,
    type: "work" | "short_break" | "long_break"
  }
}

type TasksType = {
  loading: boolean;
  data: FetchedTaskType[];
}

type TaskType = {
  title: string;
  note?: string;
  expectPomo?: number;
  workedPomo?: number;
  complete: boolean;
  sub_tasks?: Array;
  completeDate?: Date | moment;
  remind?: Date | moment;
  createdAt: Date | moment;
  publishedAt: Date | moment;
  updatedAt: Date | moment;
}

type FetchedTaskType = {
  id: number;
  attributes: TaskType
}
