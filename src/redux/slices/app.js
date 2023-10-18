import { createSlice } from "@reduxjs/toolkit";
import { dispatch } from "../store";
const initialState = {
  sideBar: {
    type: "CONTACT",
    open: false,
  },
};
const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    updateUser(state, action) {
      state.user = action.payload.user;
    },
    // Toggle Sidebar
    toggleSideBar(state) {
      state.sideBar.open = !state.sideBar.open;
    },
  },
});

export default slice.reducer;

export function ToggleSidebar() {
  return async () => {
    dispatch(slice.actions.toggleSideBar());
  };
}
export function UpdateSidebarType(type) {
  return async () => {
    dispatch(slice.actions.updateSideBarType({ type }));
  };
}
