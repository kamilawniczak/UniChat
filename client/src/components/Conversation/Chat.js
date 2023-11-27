import { Box, CircularProgress, Stack } from "@mui/material";
import React, { useEffect } from "react";

import Message from "./Message";
import { useDispatch, useSelector } from "react-redux";
import {
  GetCurrentGroupMessages,
  GetCurrentMessages,
  ReceiveGroupMessages,
  ReceiveMessages,
  getConversations,
  getDirectConversations,
  getGroupConversations,
} from "../../redux/slices/conversation";
import { socket } from "../../socket";

const Chat = () => {
  const {
    current_meessages: directMessages,
    current_conversation: directConversation,
    conversations: directConversations,
  } = useSelector(getDirectConversations());

  const {
    current_meessages: groupMessages,
    current_conversation: groupConversation,
    conversations: groupConversations,
  } = useSelector(getGroupConversations());

  const { isLoadingMsg } = useSelector(getConversations());
  const dispatch = useDispatch();

  const { chat_type } = useSelector((state) => state.app);

  let current_meessages =
    chat_type === "OneToOne" ? directMessages : groupMessages;
  let current_conversation =
    chat_type === "OneToOne" ? directConversation : groupConversation;
  let current_conversations =
    chat_type === "OneToOne" ? directConversations : groupConversations;

  const room_id = current_conversation.room_id;
  useEffect(() => {
    if (chat_type === "OneToOne") {
      socket.emit("get_messages", current_conversation, async (data) => {
        dispatch(GetCurrentMessages({ messages: data }));
      });
    }
    if (chat_type === "OneToMany") {
      socket.emit("get_group_messages", current_conversation, async (data) => {
        dispatch(GetCurrentGroupMessages({ messages: data }));
      });
    }
  }, []);

  useEffect(() => {
    if (chat_type === "OneToOne") {
      dispatch(ReceiveMessages({ room_id }));
    }
    if (chat_type === "OneToMany") {
      dispatch(ReceiveGroupMessages({ room_id }));
    }
  }, []);

  const selectedMembers = current_conversations.find(
    (con) => con.id === room_id
  ).user_info;

  return (
    <Box p={3}>
      <Stack spacing={3}>
        {!isLoadingMsg ? (
          current_meessages?.map((mess) => (
            <Message
              key={mess.id}
              data={mess}
              members={selectedMembers}
              menu={true}
            />
          ))
        ) : (
          <Stack alignItems="center" justifyContent="center">
            <CircularProgress
              color="success"
              sx={{ width: "100px", height: "100px" }}
            />
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default Chat;
