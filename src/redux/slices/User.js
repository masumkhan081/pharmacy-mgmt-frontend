import { createSlice } from "@reduxjs/toolkit";

const initUserState = {
  userId: "",
  userName: "",
  userEmail: "",
  userRole: "",
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initUserState,
  reducers: {
    setUser: (state, action) => {
      const p = action.payload ?? {};
      state.userId = p.userId ?? p._id ?? p.id ?? "";
      state.userName = p.userName ?? p.fullName ?? p.name ?? "";
      state.userEmail = p.userEmail ?? p.email ?? "";
      state.userRole = p.userRole ?? p.role ?? "";
      state.isAuthenticated = true;
    },
    reset: () => ({ ...initUserState }),
  },
});

export const { setUser, reset } = userSlice.actions;

export default userSlice.reducer;
