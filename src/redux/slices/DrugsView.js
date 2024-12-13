import { createSlice } from "@reduxjs/toolkit";

export const drugsViewSlice = createSlice({
  name: "drugsView",
  initialState: {
    currentView: "stock",
    isModalVisible: false,
    isModalForEdit: false,
    modalData: {},
    expanded: "hidden",
    allChecked: false,
    stock: [],
    brands: [],
    generics: [],
    groups: [],
    formulations: [],
    units: [],
    manufacturers: [],
  },
  reducers: {

    setCurrentView: (state, action) => {
      const { view, data } = action.payload;
      console.log("view:   ?  ?      " + view);
      state.currentView = view;
      state[`${view}`] = data;
      state.expanded = state.expanded === "hidden" ? "block" : "block";
    },
    checkSingle: (state, action) => {
      console.log(action.payload);
      state = { ...state, currentView: action.payload };
    },
    checkAll: (state, action) => {
      console.log(action.payload);
      state = { ...state, currentView: action.payload };
    },
    initModal: (state, action) => {
      state.isModalVisible = action.payload.isModalVisible;
      state.isModalForEdit = action.payload.isModalForEdit;
    },
    closeModal: (state, action) => {
      console.log("action.payload.isModalVisible: ",action.payload.isModalVisible);
      state.isModalVisible = action.payload.isModalVisible;
    },
    setModaldata: (state, action) => {
      console.log("setModaldata . .payload:   ", action.payload);
      state.modalData = action.payload;
    },
    setManufacturers: (state, action) => {
      console.log("mfrs: acation-payload:  " + JSON.stringify(action.payload));
      state.manufacturers = action.payload.data
    },
    setStock: (state, action) => {
      console.log("stock: ---- acation-payload:  " + JSON.stringify(action.payload));
      state.stock = action.payload.data
    },
    setFormulations: (state, action) => {
      console.log("mfrs: acation-payload:  " + JSON.stringify(action.payload));
      state.manufacturers = action.payload.data
    },
    setBrands: (state, action) => {
      console.log("brands: acation-payload:  " + JSON.stringify(action.payload));
      state.brands = action.payload.data
    },
    setUnits: (state, action) => {
      console.log("units: - : acation-payload:  " + JSON.stringify(action.payload));
      state.units = action.payload.data
    },
    setGroups: (state, action) => {
      state.groups = action.payload.data
    },
    setGenerics: (state, action) => {
      state.generics = action.payload
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
export const { setCurrentView, checkSingle, checkAll, initModal, setModaldata, closeModal, setBrands, setStock, setFormulations, setUnits, setManufacturers, setGroups, setGenerics } = drugsViewSlice.actions;

export default drugsViewSlice.reducer;
