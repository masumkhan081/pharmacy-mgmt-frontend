import { createSlice } from "@reduxjs/toolkit";

export const staffViewSlice = createSlice({
  name: "staffView",
  initialState: {
    currentView: "",
    expanded: "hidden",
    allChecked: false,
    salaries: [],
    members: [],
    attendances: [],
    //
    isModalVisible: false,
    isModalForEdit: false,
    modalData: {},
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
  staffViewSlice.actions;

export default staffViewSlice.reducer;
