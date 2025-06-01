import { createSlice } from "@reduxjs/toolkit";

const projectSlice = createSlice({
  name: "projects",
  initialState: {
    projects: []
  },
  reducers: {
    setProjects: (state, action) => {
      state.projects = action.payload;
    },
    addProject: (state, action) => {
      state.projects.push(action.payload);
    },
    updateProject: (state, action) => {
      const index = state.projects.findIndex(item => item._id == action.payload._id);
      if(index !== -1)
      {
        state.projects[index] = action.payload;
      }
    },
    updateMember: (state, action) => {
      console.log(action);
      const index = state.projects.findIndex(item => item._id == action.payload.project._id);
      if(index !== -1)
      {
        state.projects[index].membersId.push(action.payload.member);
      }
    }
  }
});

export const {setProjects, addProject, updateProject, updateMember} = projectSlice.actions;
export default projectSlice.reducer;