import { createSlice } from "@reduxjs/toolkit";

import axios from "../../utils/axios";

const initialState = {
  isLoggedIn: false,
  token: "",
  isLoading: false,
  user_id: null,
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
      state.isLoggedIn = false;
      state.token = "";
      state.user_id = null;
    },
  },
});

// Reducer
export default slice.reducer;

export function LoginUser(formValues) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

    try {
      const response = await axios.post(
        "/auth/login",
        { ...formValues },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response);
      dispatch(
        slice.actions.logIn({
          isLoggedIn: true,
          token: response.data.token,
          user_id: response.data.user_id,
        })
      );

      dispatch(
        slice.actions.updateIsLoading({ isLoading: false, error: false })
      );
    } catch (error) {
      console.log(error);

      dispatch(
        slice.actions.updateIsLoading({ isLoading: false, error: true })
      );
    }
  };
}

export function LogoutUser() {
  return (disaptch, getValues) => {
    disaptch(slice.actions.logOut());
  };
}

export function ForgotPassword(formValues) {
  return async (dispatch, getState) => {
    try {
      const response = await axios.post(
        "/auth/forgot-password",
        { ...formValues },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);

      dispatch(
        slice.actions.updateIsLoading({ isLoading: false, error: true })
      );
    }
  };
}
export function getAuthValues() {
  return (store) => store.auth;
}

export function NewPassword(formValues) {
  return async (dispatch, getState) => {
    try {
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
      console.log(response);
    } catch (error) {
      console.log(error);

      dispatch(
        slice.actions.updateIsLoading({ isLoading: false, error: true })
      );
    }
  };
}
