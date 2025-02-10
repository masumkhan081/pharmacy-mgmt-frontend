import { createSlice } from "@reduxjs/toolkit";

const initUserState = {
  username: "",
  email: "",
  id: "",
  role: "",
  authenticated: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initUserState,
  reducers: {
    setUser: (state, action) => {
      state.username = action.payload.username;
      state.authenticated = true;
      state.email = action.payload.email;
      state.role = action.payload.role;
    },
    reset: (state) => {
      return { ...initUserState };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser, reset } = userSlice.actions;

export default userSlice.reducer;
