import { createSlice } from "@reduxjs/toolkit";

export const drugsViewSlice = createSlice({
   name: "navView",
   initialState: {
      currentView: "stock",
      isModalVisible: false,
      isModalForEdit: false,
      modalData: {},
      expanded: "hidden",
   },
   reducers: {

      setCurrentView: (state, action) => {
         const { view, data } = action.payload;
         console.log("view:   ?  ?      " + view);
         state.currentView = view;
         state[`${view}`] = data;
         state.expanded = state.expanded === "hidden" ? "block" : "block";
      },

      toggleModal: (state, action) => {
         state.isModalVisible = action.payload.isModalVisible;
         state.isModalForEdit = action.payload.isModalForEdit;
      },
      toggleModal: (state, action) => {
         state.isModalVisible = action.payload.isModalVisible;
      },
   },
});

// Action creators are generated for each case reducer function
export const { setCurrentView, toggleModal, toggleModal } = drugsViewSlice.actions;

export default drugsViewSlice.reducer;
