import { createSlice } from "@reduxjs/toolkit";

export const notificationViewSlice = createSlice({
  name: "notificationView",
  initialState: {
    currentView: "notifications",
    isModalVisible: false,
    isModalForEdit: false,
    modalData: {},
    allChecked: false,
    notifications: [],
    refreshKey: 0,
  },
  reducers: {
    setCurrentView: (state, action) => {
      const { view, data } = action.payload;
      state.currentView = view;
      if (data !== undefined) state[view] = data;
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload?.data ?? action.payload ?? [];
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
  setNotifications,
  toggleModal,
  setModaldata,
  checkSingle,
  checkAll,
  bumpRefresh,
} = notificationViewSlice.actions;

export default notificationViewSlice.reducer;
