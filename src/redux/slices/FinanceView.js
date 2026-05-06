import { createSlice } from "@reduxjs/toolkit";

export const financeViewSlice = createSlice({
  name: "financeView",
  initialState: {
    currentView: "invoices",
    isModalVisible: false,
    isModalForEdit: false,
    modalData: {},
    allChecked: false,
    refreshKey: 0,
  },
  reducers: {
    setCurrentView: (state, action) => {
      const { view } = action.payload;
      state.currentView = view;
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
    checkSingle: (state) => {
      state.allChecked = false;
    },
    checkAll: (state) => {
      state.allChecked = !state.allChecked;
    },
    bumpRefresh: (state) => {
      state.refreshKey += 1;
    },
  },
});

export const {
  setCurrentView,
  toggleModal,
  setModaldata,
  checkSingle,
  checkAll,
  bumpRefresh,
} = financeViewSlice.actions;
export default financeViewSlice.reducer;
