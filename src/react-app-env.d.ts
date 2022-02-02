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
  pomoConfig: PomoConfigType;
  // preferenceCOnfig
  // goalsCOnfig
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
}

// Timer, Countodown & Pomoconfig
type CountdownType = {
  end: number,
  status: CountdownStatusType;
  type: PomoWorkTypes;
  pomoID: string;

}
type PomoConfigType = {
  workDuration: number,
  shortBreakDuration: number,
  longBreakDuration: number,
  pomoBeforeLongBreak: number,
}


type PomoControlType = {
  pomos: PomoType[];
  total: number;
  loading: boolean;
}

type PomoType = {
  id: string,
  attributes: {
    start: Date,
    end: Date,
    tasks: FetchedTaskType[],
    status: StatusType;
    remain: number,
    type: PomoWorkTypes
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

type CountdownStatusType = "running" | "finish" | "pause" | "waiting";
type StatusType = "running" | "completed" | "canceled" | "pause";
type PomoWorkTypes = "work" | "short_break" | "long_break";