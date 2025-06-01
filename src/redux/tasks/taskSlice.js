import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: []
  },
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(task => task._id == action.payload._id);
      if(index !== -1)
      {
        state.tasks[index] = action.payload
      }
    },
    updateStatus: (state, action) => {
      const index = state.tasks.findIndex(task => task._id == action.payload._id);
      if(index !== -1)
      {
        state.tasks[index] = action.payload
      }
    },
    removeTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task._id != action.payload);
    }
  }
});

export const {addTask, setTasks, updateTask, updateStatus, removeTask} = taskSlice.actions;

export default taskSlice.reducer;