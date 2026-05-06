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
    salaries: [],
    members: [],
    attendances: [],
    refreshKey: 0,
  },
  reducers: {
    setCurrentView: (state, action) => {
      const { view, data } = action.payload;
      state.currentView = view;
      state[`${view}`] = data;
    },
    checkSingle: (state) => {
      state.allChecked = false;
    },
    checkAll: (state) => {
      state.allChecked = !state.allChecked;
    },
    toggleModal: (state, action) => {
      state.isModalVisible = action.payload.isModalVisible;
      if (action.payload.isModalForEdit !== undefined) {
        state.isModalForEdit = action.payload.isModalForEdit;
      }
      if (!action.payload.isModalVisible) {
        state.modalData = {};
        state.isModalForEdit = false;
      }
    },
    setModaldata: (state, action) => {
      state.modalData = action.payload ?? {};
    },
    bumpRefresh: (state) => {
      state.refreshKey += 1;
    },
  },
});

export const {
  setCurrentView,
  checkSingle,
  checkAll,
  toggleModal,
  setModaldata,
  bumpRefresh,
} = staffViewSlice.actions;

export default staffViewSlice.reducer;
