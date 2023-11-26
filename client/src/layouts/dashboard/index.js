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
  AddGroupConversation,
  AddGroupMessage,
  AddUnreadGroupMessage,
  AddUnreadMessage,
  DeleteDirectMessage,
  DeleteGroupMessage,
  UpdateDirectMessage,
  UpdateGroupMessage,
  UpdateOnline,
  getDirectConversations,
  getGroupConversations,
  getGroupRoomId,
  getRoomId,
} from "../../redux/slices/conversation";

const DashboardLayout = () => {
  const isLoggedIn = useSelector(getIsLoggedIn());
  const user_id = window.localStorage.getItem("user_id");
  const { conversations, current_conversation } = useSelector(
    getDirectConversations()
  );
  const {
    conversations: group_conversation,
    current_conversation: current_group_conversation,
  } = useSelector(getGroupConversations());
  const dispatch = useDispatch();

  const directRoomId = useSelector(getRoomId());
  const groupRoomId = useSelector(getGroupRoomId());

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

        const [from] = data.members.filter((mem) => mem._id !== user_id);
        if (!existing_conversation) {
          dispatch(
            OpenSnackBar({
              severity: "success",
              message: `New conversation with ${from.firstName} ${from.lastName}`,
            })
          );
          dispatch(AddDirectConversation(data));
        }
      });
      socket.on("start_group_chat", (data) => {
        const existing_group_conversation = group_conversation.find(
          (el) => el?.id === data._id
        );
        dispatch(
          OpenSnackBar({
            severity: "success",
            message: `New group created: ${data.title}`,
          })
        );

        if (!existing_group_conversation) {
          dispatch(AddGroupConversation(data));
        }
      });

      socket.on("new_message", (data) => {
        const message = data.message;

        const fittedMessage = {
          id: message?._id,
          type: "msg",
          from: message.from,
          subtype: message?.subtype,
          message: message.text,
          reaction: [],
          incoming: message.to === user_id,
          outgoing: message.from === user_id,
          file: message.file,
        };

        if (current_conversation?.room_id === data?.conversation_id) {
          dispatch(AddDirectMessage(fittedMessage));
        }

        if (data.user_info) {
          dispatch(
            OpenSnackBar({
              severity: "success",
              message: `new message from ${data.user_info.firstName} ${data.user_info.lastName}`,
            })
          );
          dispatch(
            AddUnreadMessage({
              room_id: data?.conversation_id,
              message: fittedMessage,
            })
          );
        }
      });
      socket.on("new_group_message", (data) => {
        const message = data.message;
        const fittedMessage = {
          id: message?._id,
          type: "msg",
          from: message.from,
          subtype: message?.subtype,
          message: message.text,
          reaction: [],
          incoming: message.to === user_id,
          outgoing: message.from === user_id,
          file: message.file,
        };
        if (current_group_conversation?.room_id === data?.conversation_id) {
          dispatch(AddGroupMessage(fittedMessage));
        }
        if (data.user_info) {
          dispatch(
            OpenSnackBar({
              severity: "success",
              message: `new message from ${data.user_info.firstName} ${data.user_info.lastName}`,
            })
          );
          dispatch(
            AddUnreadGroupMessage({
              room_id: data?.conversation_id,
              message: fittedMessage,
            })
          );
        }
      });
      socket.on("statusChanged", ({ to, from, online }) => {
        if (to === user_id) {
          dispatch(UpdateOnline({ online, from }));
        }
      });
      socket.on("receiveFiles", (data) => {
        dispatch(UpdateDirectMessage(data));

        dispatch(UpdateGroupMessage(data));
      });
      socket.on("reactionToMsg", ({ reaction, msgId, chat_type, room_id }) => {
        if (
          chat_type === "OneToOne" &&
          current_conversation.room_id &&
          current_conversation.room_id === room_id
        ) {
          dispatch(UpdateDirectMessage({ reaction, _id: msgId }));
        }
        if (
          chat_type === "OneToMany" &&
          current_group_conversation.room_id &&
          current_group_conversation.room_id === room_id
        ) {
          dispatch(UpdateGroupMessage({ reaction, _id: msgId }));
        }
      });
      socket.on("deletedMessage", ({ room_id, msgId, chat_type }) => {
        console.log(room_id, msgId, chat_type);
        if (chat_type === "OneToOne") {
          if (directRoomId !== room_id) return;
          dispatch(DeleteDirectMessage({ id: msgId }));
        }
        if (chat_type === "OneToMany") {
          if (groupRoomId !== room_id) return;
          dispatch(DeleteGroupMessage({ id: msgId }));
        }
      });
    }

    return () => {
      socket?.off("new_friend_request");
      socket?.off("request_accepted");
      socket?.off("request_sent");
      socket?.off("start_chat?");
      socket?.off("start_group_chat");
      socket?.off("new_message");
      socket?.off("new_group_message");
      socket?.off("statusChanged");
      socket?.off("receiveFiles");
      socket?.off("reactionToMsg");
      socket?.off("deletedMessage");
    };
  }, [
    isLoggedIn,
    socket,
    current_conversation,
    current_conversation?.room_id,
    current_group_conversation,
    current_group_conversation?.room_id,
    user_id,
    dispatch,
  ]);

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
