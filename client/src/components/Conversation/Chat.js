import { Box, Stack } from "@mui/material";
import React, { useEffect } from "react";

import Message from "./Message";
import { useDispatch, useSelector } from "react-redux";
import {
  GetCurrentMessages,
  getDirectConversations,
} from "../../redux/slices/conversation";
import { socket } from "../../socket";

const Chat = () => {
  const { current_meessages, current_conversation } = useSelector(
    getDirectConversations()
  );
  const dispatch = useDispatch();

  useEffect(() => {
    socket.emit("get_messages", current_conversation, async (data) => {
      dispatch(GetCurrentMessages({ messages: data }));
    });
  }, [current_conversation.room_id]);

  return (
    <Box p={3}>
      <Stack spacing={3}>
        {current_meessages?.map((mess) => (
          <Message key={mess.id} data={mess} menu={true} />
        ))}
      </Stack>
    </Box>
  );
};

export default Chat;
