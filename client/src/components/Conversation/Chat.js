import { Box, Divider, Stack, Typography } from "@mui/material";
import React from "react";
import { Chat_History } from "../../data";
import Message from "./Message";

const Chat = () => {
  return (
    <Box p={3}>
      <Stack spacing={3}>
        {Chat_History.map((mess, i) => (
          <Message data={mess} menu={true} key={i} />
        ))}
      </Stack>
    </Box>
  );
};

export default Chat;
