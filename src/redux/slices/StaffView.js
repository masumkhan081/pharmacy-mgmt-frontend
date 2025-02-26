import { createSlice } from "@reduxjs/toolkit";

export const staffViewSlice = createSlice({
  name: "staffView",
  initialState: {
    currentView: "members",
    isModalVisible: false,
    isModalForEdit: false,
    expanded: "hidden",
    allChecked: false,
    modalData: {},
    // 
    salaries: [],
    members: [],
    attendances: [],
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
    toggleModal: (state, action) => {
      state.isModalVisible = action.payload.isModalVisible;
      if (action.payload.isModalForEdit !== undefined) {
        state.isModalForEdit = action.payload.isModalForEdit;
      }
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
export const { setCurrentView, checkSingle, checkAll, toggleModal, deletHandler } =
  staffViewSlice.actions;

export default staffViewSlice.reducer;
