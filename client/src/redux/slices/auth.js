import { createSlice } from "@reduxjs/toolkit";

import axios from "../../utils/axios";
import { OpenSnackBar } from "./app";
import { socket } from "../../socket";

const initialState = {
  isLoggedIn: false,
  token: "",
  isLoading: false,
  user_id: null,
  email: "",
  error: false,
  userInfo: {
    firstName: "",
    lastName: "",
    avatar: null,
  },
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateIsLoading(state, action) {
      state.error = action.payload.error;
      state.isLoading = action.payload.isLoading;
    },
    logIn(state, action) {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.token = action.payload.token;
      state.user_id = action.payload.user_id;
    },
    logOut(state, action) {
      const friends = action.payload.friends;

      socket.emit("logout", { user_id: state.user_id });
      socket.emit("setStatus", {
        user_id: state.user_id,
        friends,
        online: false,
      });
      state.isLoggedIn = false;
      state.token = "";
      state.user_id = null;
    },
    updateRegisterEmail(state, action) {
      state.email = action.payload.email;
    },
    userInfo(state, action) {
      state.userInfo = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

export function LoginUser(formValues) {
  return async (dispatch, getValues) => {
    try {
      dispatch(
        slice.actions.updateIsLoading({ isLoading: true, error: false })
      );
      const response = await axios.post(
        "/auth/login",
        { ...formValues },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      window.localStorage.setItem("user_id", response.data.user_id);
      dispatch(
        slice.actions.logIn({
          isLoggedIn: true,
          token: response.data.token,
          user_id: response.data.user_id,
        })
      );

      dispatch(slice.actions.userInfo(response.data.userInfo));

      dispatch(
        OpenSnackBar({ message: response.data.message, severity: "success" })
      );

      dispatch(
        slice.actions.updateIsLoading({ isLoading: false, error: false })
      );
    } catch (error) {
      dispatch(
        slice.actions.updateIsLoading({ isLoading: false, error: true })
      );
      dispatch(OpenSnackBar({ message: error.message, severity: "error" }));
    }
  };
}

export function LogoutUser() {
  return async (dispatch, getValues) => {
    const conversations = getValues()?.coversations?.direct_chat?.conversations.map(
      (conversation) => {
        return conversation.user_id;
      }
    );
    const friends = conversations.flat();

    window.localStorage.removeItem("user_id");
    await dispatch(slice.actions.logOut({ friends }));

    await dispatch(
      OpenSnackBar({
        message: "logged out seccessfully",
        severity: "success",
      })
    );
  };
}

export function ForgotPassword(formValues) {
  return async (dispatch, getState) => {
    try {
      dispatch(
        slice.actions.updateIsLoading({ isLoading: true, error: false })
      );
      const response = await axios.post(
        "/auth/forgot-password",
        { ...formValues },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      dispatch(
        slice.actions.updateIsLoading({ isLoading: true, error: false })
      );
      window.location.href = "/auth/login";
    } catch (error) {
      dispatch(
        slice.actions.updateIsLoading({ isLoading: false, error: true })
      );
    }
  };
}

export function NewPassword(formValues) {
  return async (dispatch, getState) => {
    try {
      dispatch(
        slice.actions.updateIsLoading({ isLoading: true, error: false })
      );
      const response = await axios.post(
        "/auth/new-password",
        { ...formValues },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      dispatch(
        slice.actions.logIn({ isLoggedIn: true, token: response.data.token })
      );
      dispatch(
        slice.actions.updateIsLoading({ isLoading: true, error: false })
      );
    } catch (error) {
      dispatch(
        slice.actions.updateIsLoading({ isLoading: false, error: true })
      );
    }
  };
}

export function RegisterNewUser(formValues) {
  return async (dispatch, getState) => {
    try {
      dispatch(
        slice.actions.updateIsLoading({ isLoading: true, error: false })
      );
      const response = await axios.post(
        "/auth/register",
        { ...formValues },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      dispatch(slice.actions.updateRegisterEmail({ email: formValues.email }));
      dispatch(
        slice.actions.updateIsLoading({ isLoading: false, error: false })
      );
      window.localStorage.setItem("user_id", response.data.user_id);
    } catch (error) {
      console.log(error);

      dispatch(
        slice.actions.updateIsLoading({ isLoading: false, error: true })
      );
    } finally {
      if (!getState().auth.error) {
        window.location.href = "/auth/verify";
      }
    }
  };
}

export function VerifyEmail(formValues) {
  return async (dispatch, getState) => {
    const { email } = getState().auth;
    try {
      dispatch(
        slice.actions.updateIsLoading({ isLoading: true, error: false })
      );
      const response = await axios.post(
        "/auth/verify",
        { ...formValues, email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      window.localStorage.setItem("user_id", response.data.user_id);
      dispatch(
        slice.actions.logIn({
          isLoggedIn: true,
          token: response.data.token,
        })
      );
      dispatch(
        slice.actions.updateIsLoading({ isLoading: true, error: false })
      );
      window.localStorage.setItem("user_id", response.data.user_id);
    } catch (error) {
      dispatch(
        slice.actions.updateIsLoading({ isLoading: false, error: true })
      );
    }
  };
}

export function getIsLoggedIn() {
  return (store) => store.auth.isLoggedIn;
}
export function getIsLoadingAuth() {
  return (store) => store.auth.isLoading;
}
export function getUserId() {
  return (store) => store.auth.user_id;
}
export function getUserInfo() {
  return (store) => store.auth.userInfo;
}
