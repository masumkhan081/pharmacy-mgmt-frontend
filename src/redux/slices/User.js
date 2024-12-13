import { createSlice } from "@reduxjs/toolkit";

export const saleSlice = createSlice({
   name: "user",
   initialState: {
      username: "",
      email: "",
      id: "",
      role: "salesman",
      authenticated: false,
   },
   reducers: {
      setUser: (state, action) => {
         const { data } = action.payload;
         // state.currentView = view;
      },
   },
});

// Action creators are generated for each case reducer function
export const { setUser } =
   saleSlice.actions;

export default saleSlice.reducer;
