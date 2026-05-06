import { createSlice } from "@reduxjs/toolkit";

export const saleSlice = createSlice({
  name: "sales",
  initialState: {
    currentView: "",
    sales: [],
    allChecked: false,
    isModalVisible: false,
    isModalForEdit: false,
    modalData: {},
    refreshKey: 0,
  },
  reducers: {
    setCurrentView: (state, action) => {
      const { view, data } = action.payload;
      state.currentView = view;
      state[`${view}`] = data;
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
} = saleSlice.actions;
export default saleSlice.reducer;
