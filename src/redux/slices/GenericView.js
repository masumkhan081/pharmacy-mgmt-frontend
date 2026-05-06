import { createSlice } from "@reduxjs/toolkit";

export const makeGenericViewSlice = (name) =>
  createSlice({
    name,
    initialState: {
      isModalVisible: false,
      isModalForEdit: false,
      modalData: {},
      allChecked: false,
      refreshKey: 0,
    },
    reducers: {
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
