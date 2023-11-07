import { Box, CircularProgress, Stack } from "@mui/material";
import React, { useEffect } from "react";

import Message from "./Message";
import { useDispatch, useSelector } from "react-redux";
import {
  GetCurrentMessages,
  ReceiveMessages,
  getConversations,
  getDirectConversations,
  getRoomId,
} from "../../redux/slices/conversation";
import { socket } from "../../socket";

const Chat = () => {
  const { current_meessages, current_conversation } = useSelector(
    getDirectConversations()
  );
  const { isLoadingMsg } = useSelector(getConversations());
  const dispatch = useDispatch();
  const room_id = useSelector(getRoomId());

  useEffect(() => {
    socket.emit("get_messages", current_conversation, async (data) => {
      dispatch(GetCurrentMessages({ messages: data }));
    });
  }, [current_conversation.room_id]);

  useEffect(() => {
    dispatch(ReceiveMessages({ room_id }));
  }, [room_id, dispatch]);

  return (
    <Box p={3}>
      <Stack spacing={3}>
        {!isLoadingMsg ? (
          current_meessages?.map((mess) => (
            <Message key={mess.id} data={mess} menu={true} />
          ))
        ) : (
          <Stack
            alignItems="center"
            justifyContent="center"
            // sx={{
            //   height: "100vh",
            // }}
          >
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
