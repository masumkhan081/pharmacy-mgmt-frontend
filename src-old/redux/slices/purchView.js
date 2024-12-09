import { createSlice } from "@reduxjs/toolkit";
import {purchases} from '../../static-data/table'

export const purchSlice = createSlice({
  name: "purchases",
  initialState: {
    currentView: "",
    allChecked: false,
    purchases: [],
    
  },
  reducers: {
    setCurrentView: (state, action) => {
      const { view, data } = action.payload;
      state.currentView = view;
      state[`${view}`] = data;
    },
    checkSingle: (state, action) => {
      console.log(action.payload);
      state = { ...state, currentView: action.payload };
    },
    checkAll: (state, action) => {
      console.log(action.payload);
      state = { ...state, currentView: action.payload };
    },
    deletHandler: (state, action) => {
      console.log(action.payload);
      // state.booklist = state.booklist.filter((book)=>{
      //   return book!== action.payload
      // })
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCurrentView, checkSingle, checkAll, deletHandler } =
  purchSlice.actions;

export default purchSlice.reducer;
