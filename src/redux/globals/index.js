import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  isDarkMode: false,
  isSiderMenuCollapsed: false
}

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsDarkMode: (state, action) => {
      state.isDarkMode = action.payload
    },
    setIsSiderMenuCollapsed: (state, action) => {
      state.isSiderMenuCollapsed = action.payload
    }
  }
});

export const {setIsDarkMode, setIsSiderMenuCollapsed} = globalSlice.actions;

export default globalSlice.reducer;