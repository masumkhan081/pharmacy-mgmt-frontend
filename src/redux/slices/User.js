import { createSlice } from "@reduxjs/toolkit";

const initUserState = {
  userName: "",
  userEmail: "",
  userId: "",
  userRole: "",
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initUserState,
  reducers: {
    setUser: (state, action) => {
      state.userName = action.payload.userName;
      state.isAuthenticated = true;
      state.userEmail = action.payload.userEmail;
      state.userRole = action.payload.userRole;
    },
    reset: (state) => {
      return { ...initUserState };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser, reset } = userSlice.actions;

export default userSlice.reducer;
