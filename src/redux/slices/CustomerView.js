import { createSlice } from "@reduxjs/toolkit";

export const customerViewSlice = createSlice({
  name: "customerView",
  initialState: {
    currentView: "customers",
    isModalVisible: false,
    isModalForEdit: false,
    modalData: {},
    allChecked: false,
    customers: [],
    refreshKey: 0,
  },
  reducers: {
    setCurrentView: (state, action) => {
      const { view, data } = action.payload;
      state.currentView = view;
      if (data !== undefined) state[view] = data;
    },
    setCustomers: (state, action) => {
      state.customers = action.payload?.data ?? action.payload ?? [];
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
  setCustomers,
  toggleModal,
  setModaldata,
  checkSingle,
  checkAll,
  bumpRefresh,
} = customerViewSlice.actions;

export default customerViewSlice.reducer;
