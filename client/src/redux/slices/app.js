import { createSlice } from "@reduxjs/toolkit";
import { func } from "prop-types";

const initialState = {
  sideBar: {
    type: "CONTACT",
    open: false,
  },
  snackbar: {
    open: null,
    message: null,
    severity: null,
  },
};
const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    updateSideBarType(state, action) {
      state.sideBar.type = action.payload;
    },

    // Toggle Sidebar
    toggleSideBar(state) {
      state.sideBar.open = !state.sideBar.open;
      state.sideBar.type = "CONTACT";
    },
    openSnackBar(state, action) {
      state.snackbar.open = true;
      state.snackbar.severity = action.payload.severity;
      state.snackbar.message = action.payload.message;
    },
    closeSnackBar(state, action) {
      state.snackbar.open = null;
      state.snackbar.severity = null;
      state.snackbar.message = null;
    },
  },
});

export default slice.reducer;

export function ToggleSidebar() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.toggleSideBar());
  };
}
export function UpdateSidebarType(type) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateSideBarType(type));
  };
}
export function OpenSnackBar({ severity, message }) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.openSnackBar({ severity, message }));

    setTimeout(() => {
      dispatch(slice.actions.closeSnackBar());
    }, 4000);
  };
}
export function CloseSnackBar() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.closeSnackBar());
  };
}

export function getSnackBarApp() {
  return (store) => store.app.snackbar;
}
export function getSideBarApp() {
  return (store) => store.app.sideBar;
}
