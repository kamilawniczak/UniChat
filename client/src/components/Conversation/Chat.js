import { Box, Stack } from "@mui/material";
import React from "react";
import { Chat_History } from "../../data";
import Message from "./Message";

const Chat = () => {
  return (
    <Box p={3}>
      <Stack spacing={3}>
        {Chat_History.map((mess) => (
          <Message key={mess.id} data={mess} menu={true} />
        ))}
      </Stack>
    </Box>
  );
};

export default Chat;
