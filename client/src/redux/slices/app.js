import { createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

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
  users: [],
  friends: [],
  friendRequests: [],

  chat_type: null,
  room_id: null,
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
    closeSideBar(state) {
      state.sideBar.open = false;
      state.sideBar.type = "CONTACT";
    },
    openSnackBar(state, action) {
      state.snackbar.open = true;
      state.snackbar.severity = action.payload.severity;
      state.snackbar.message = action.payload.message;
    },
    closeSnackBar(state) {
      state.snackbar.open = null;
      state.snackbar.severity = null;
      state.snackbar.message = null;
    },
    updateUsers(state, action) {
      state.users = action.payload.users;
    },
    updateFriends(state, action) {
      state.friends = action.payload.friends;
    },
    updateFriendRequests(state, action) {
      state.friendRequests = action.payload.friendRequests;
    },
    selectRoom(state, action) {
      if (state.room_id === action.payload.room_id) {
        state.chat_type = null;
        state.room_id = null;
        return;
      }

      if (action.payload.isGroupChat) {
        state.chat_type = "OneToMany";
      } else {
        state.chat_type = "OneToOne";
      }
      state.room_id = action.payload.room_id;
    },
    resetRoom(state) {
      state.chat_type = null;
      state.room_id = null;
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
  return (dispatch, getState) => {
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
export function GetUsers() {
  return async (dispatch, getState) => {
    try {
      const response = await axios.get("/user/get-users", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().auth.token}`,
        },
      });

      const users = response.data.data.filter(
        (user) => user._id !== getState().auth.user_id
      );

      dispatch(slice.actions.updateUsers({ users: users }));
    } catch (error) {
      console.log(error);
    }
  };
}

export function GetFriends() {
  return async (dispatch, getState) => {
    try {
      const response = await axios.get("/user/get-friends", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().auth.token}`,
        },
      });
      dispatch(slice.actions.updateFriends({ friends: response.data.data }));
    } catch (error) {
      console.log(error);
    }
  };
}
export function GetFriendRequests() {
  return async (dispatch, getState) => {
    try {
      const response = await axios.get("/user/get-friend-request", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().auth.token}`,
        },
      });
      dispatch(
        slice.actions.updateFriendRequests({
          friendRequests: response.data.data,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
}

export function SelectRoom({ room_id, isGroupChat }) {
  return (dispatch, getState) => {
    dispatch(slice.actions.closeSideBar());
    dispatch(slice.actions.selectRoom({ room_id, isGroupChat }));
  };
}
export function ResetRoom() {
  return (dispatch, getState) => {
    dispatch(slice.actions.closeSideBar());
    dispatch(slice.actions.resetRoom());
  };
}

export function getSnackBarApp() {
  return (store) => store.app.snackbar;
}
export function getSideBarApp() {
  return (store) => store.app.sideBar;
}
export function getUsers() {
  return (store) => store.app.users;
}
export function getFriends() {
  return (store) => store.app.friends;
}
export function getFriendRequests() {
  return (store) => store.app.friendRequests;
}
export function getChatType() {
  return (store) => store.app.chat_type;
}
export function getRoomId() {
  return (store) => store.app.room_id;
}
