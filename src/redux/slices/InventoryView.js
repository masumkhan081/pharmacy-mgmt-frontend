import { createSlice } from "@reduxjs/toolkit";

export const inventoryViewSlice = createSlice({
  name: "inventoryView",
  initialState: {
    currentView: "batches",
    isModalVisible: false,
    isModalForEdit: false,
    modalData: {},
    allChecked: false,
    batches: [],
    alerts: [],
    refreshKey: 0,
  },
  reducers: {
    setCurrentView: (state, action) => {
      const { view, data } = action.payload;
      state.currentView = view;
      if (data !== undefined) state[view] = data;
    },
    setBatches: (state, action) => {
      state.batches = action.payload?.data ?? action.payload ?? [];
    },
    setAlerts: (state, action) => {
      state.alerts = action.payload?.data ?? action.payload ?? [];
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
  setBatches,
  setAlerts,
  toggleModal,
  setModaldata,
  checkSingle,
  checkAll,
  bumpRefresh,
} = inventoryViewSlice.actions;

export default inventoryViewSlice.reducer;
