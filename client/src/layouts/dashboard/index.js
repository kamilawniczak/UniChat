import { Navigate, Outlet } from "react-router-dom";

import SideBar from "./SideBar";
import { Stack } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getIsLoggedIn } from "../../redux/slices/auth";
import { useEffect } from "react";
import { connectSocket, socket } from "../../socket";
import { OpenSnackBar } from "../../redux/slices/app";

const DashboardLayout = () => {
  const isLoggedIn = useSelector(getIsLoggedIn());
  const user_id = window.localStorage.getItem("user_id");
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn) {
      window.onload = () => {
        if (!window.location.hash) {
          window.location = window.location + "#loaded";
          window.location.reload();
        }
      };

      if (!socket) {
        connectSocket(user_id);
      }

      socket.on("new_friend_request", (data) => {
        dispatch(OpenSnackBar({ severity: "success", message: data.message }));
      });
      socket.on("request_accepted", (data) => {
        dispatch(OpenSnackBar({ severity: "success", message: data.message }));
      });
      socket.on("request_sent", (data) => {
        dispatch(OpenSnackBar({ severity: "success", message: data.message }));
      });
    }

    return () => {
      socket.off("new_friend_request");
      socket.off("request_accepted");
      socket.off("request_sent");
    };
  }, [isLoggedIn, socket]);

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" />;
  }

  return (
    <Stack direction="row">
      <SideBar />
      <Outlet />
    </Stack>
  );
};

export default DashboardLayout;
