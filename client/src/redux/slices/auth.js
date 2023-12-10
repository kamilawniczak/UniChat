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
    avatar: "",
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

      if (state.user_id) {
        socket.emit("logout", { user_id: state.user_id });
        socket.emit("setStatus", {
          user_id: state.user_id,
          friends,
          online: false,
        });
      }

      window.localStorage.removeItem("user_id");

      state.isLoggedIn = false;
      state.token = "";
      state.isLoading = false;
      state.user_id = null;
      state.email = "";
      state.error = false;
      state.userInfo = {
        firstName: "",
        lastName: "",
        avatar: "",
      };
    },
    updateRegisterEmail(state, action) {
      state.email = action.payload.email;
    },
    userInfo(state, action) {
      state.userInfo = action.payload;
    },
    updateUserInfo(state, action) {
      const { firstName, lastName, phone, about, avatar, email } =
        action.payload;

      state.userInfo = {
        firstName: avatar ? state.userInfo.firstName : firstName,
        lastName: avatar ? state.userInfo.lastName : lastName,
        phone: avatar ? state.userInfo.phone : phone,
        about: avatar ? state.userInfo.about : about,
        avatar: avatar || state.userInfo.avatar,
        email: email || state.userInfo.email,
      };
    },
    updateEmail(state, action) {
      const { email } = action.payload;

      state.userInfo.email = email;
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

      const loginPromise = axios.post(
        "/auth/login",
        { ...formValues },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error("Login request timed out"));
        }, 15000);
      });

      const response = await Promise.race([loginPromise, timeoutPromise]);

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
    const conversations =
      getValues()?.coversations?.direct_chat?.conversations.map(
        (conversation) => {
          return conversation.user_id;
        }
      );
    const friends = conversations.flat();

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
      await axios.post(
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
      await axios.post(
        "/auth/new-password",
        { ...formValues },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      window.location.href = "/auth/login";

      dispatch(
        slice.actions.updateIsLoading({ isLoading: false, error: false })
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
      const loginPromise = await axios.post(
        "/auth/register",
        { ...formValues },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error("Login request timed out"));
        }, 30000);
      });

      const response = await Promise.race([loginPromise, timeoutPromise]);

      dispatch(slice.actions.updateRegisterEmail({ email: formValues.email }));
      dispatch(
        slice.actions.updateIsLoading({ isLoading: false, error: false })
      );
      window.localStorage.setItem("user_id", response.data.user_id);
    } catch (error) {
      dispatch(OpenSnackBar({ message: error.message, severity: "error" }));

      dispatch(
        slice.actions.updateIsLoading({ isLoading: false, error: true })
      );
    } finally {
      const encodedEmail = encodeURIComponent(formValues.email);
      if (!getState().auth.error) {
        window.location.href = `/auth/verify?email=${encodedEmail}`;
      }
    }
  };
}

export function VerifyEmail(formValues) {
  return async (dispatch, getState) => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const encodedEmail = urlParams.get("email");
    const decodedEmail = decodeURIComponent(encodedEmail);
    const email = decodedEmail;

    console.log(email, formValues);
    try {
      dispatch(
        slice.actions.updateIsLoading({ isLoading: true, error: false })
      );
      const loginPromise = await axios.post(
        "/auth/verify",
        { ...formValues, email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error("Login request timed out"));
        }, 30000);
      });

      const response = await Promise.race([loginPromise, timeoutPromise]);

      window.localStorage.setItem("user_id", response.data.user_id);
      dispatch(
        slice.actions.updateIsLoading({ isLoading: false, error: false })
      );

      window.location.href = "/auth/login";

      window.localStorage.setItem("user_id", response.data.user_id);
    } catch (error) {
      dispatch(OpenSnackBar({ message: error.message, severity: "error" }));
      dispatch(
        slice.actions.updateIsLoading({ isLoading: false, error: true })
      );
    }
  };
}
export function UpdateUserInfo({
  firstName,
  lastName,
  phone,
  about,
  avatar,
  email,
}) {
  return (dispatch, getState) => {
    dispatch(
      slice.actions.updateUserInfo({
        firstName,
        lastName,
        phone,
        about,
        avatar,
        email,
      })
    );
  };
}
export function UpdateEmail({ email }) {
  return (dispatch, getState) => {
    dispatch(
      slice.actions.updateEmail({
        email,
      })
    );
  };
}
export function UpdateIsLoading({ isLoading }) {
  return (dispatch, getState) => {
    dispatch(slice.actions.updateIsLoading({ isLoading }));
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
