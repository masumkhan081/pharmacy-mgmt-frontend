import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
   name: "user",
   initialState: {
      username: "",
      email: "",
      id: "",
      role: "",
      authenticated: false,
   },
   reducers: {
      setUser: (state, action) => {
         alert(JSON.stringify(action.payload))
         state.username = action.payload.username;
         state.authenticated = true;
         state.email = action.payload.email;
         state.role = action.payload.role;
      },
   },
});

// Action creators are generated for each case reducer function
export const { setUser } =
   userSlice.actions;

export default userSlice.reducer;
