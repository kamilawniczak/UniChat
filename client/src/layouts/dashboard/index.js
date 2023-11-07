import { Navigate, Outlet } from "react-router-dom";

import SideBar from "./SideBar";
import { Stack } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getIsLoggedIn } from "../../redux/slices/auth";
import { useEffect } from "react";
import { connectSocket, socket } from "../../socket";
import { OpenSnackBar } from "../../redux/slices/app";
import {
  AddDirectConversation,
  AddDirectMessage,
  SetConversation,
  UpdateDirectConversation,
  UpdateOnline,
  getDirectConversations,
} from "../../redux/slices/conversation";

const DashboardLayout = () => {
  const isLoggedIn = useSelector(getIsLoggedIn());
  const user_id = window.localStorage.getItem("user_id");
  const { conversations, current_conversation } = useSelector(
    getDirectConversations()
  );
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
      socket.on("start_chat", (data) => {
        const existing_conversation = conversations.find(
          (el) => el?.id === data._id
        );

        if (!existing_conversation) {
          dispatch(AddDirectConversation(data));
        }
      });
      socket.on("new_message", (data) => {
        // console.log(data);
        const message = data.message;
        if (current_conversation?.room_id === data?.conversation_id) {
          dispatch(
            AddDirectMessage({
              id: message?._id,
              type: "msg",
              subtype: message?.subtype,
              message: message.text,
              incoming: message.to === user_id,
              outgoing: message.from === user_id,
            })
          );
        }
        if (data.user_info) {
          dispatch(
            OpenSnackBar({
              severity: "success",
              message: `new message from ${data.user_info.firstName} ${data.user_info.lastName}`,
            })
          );
        }
      });
      socket.on("statusChanged", ({ to, from, online }) => {
        if (to === user_id) {
          dispatch(UpdateOnline({ online, from }));
        }
      });
    }

    return () => {
      socket?.off("new_friend_request");
      socket?.off("request_accepted");
      socket?.off("request_sent");
      socket?.off("start_chat?");
    };
  }, [isLoggedIn, socket, current_conversation]);

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
