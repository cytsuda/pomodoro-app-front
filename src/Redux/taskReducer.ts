import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const initialState: TasksType = {
  data: []
}

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    loadTasks: (state, action: PayloadAction<FetchedTaskType[]>) => {
      state.data = action.payload;
    },
    addTask: (state, action: PayloadAction<FetchedTaskType>) => {
      state.data.push(action.payload);
    }
  },
})

// Action creators are generated for each case reducer function
export const { addTask, loadTasks } = taskSlice.actions

export default taskSlice.reducer
