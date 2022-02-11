import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const initialState: TasksControlType = {
  loading: false,
  data: []
}

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    loadingTask: (state) => {
      state.loading = true;
    },
    failTask: (state) => {
      state.loading = false;
      // TODO - add error too
    },
    getTasks: (state, action: PayloadAction<FetchedTaskType[]>) => {
      state.loading = false;
      state.data = action.payload;
    },
    addTask: (state, action: PayloadAction<FetchedTaskType>) => {
      state.loading = false;
      state.data.push(action.payload);
    }
  },
})

// Action creators are generated for each case reducer function
export const { addTask, getTasks, loadingTask, failTask } = taskSlice.actions

export default taskSlice.reducer
