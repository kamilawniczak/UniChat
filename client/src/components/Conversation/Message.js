import { Box, Stack } from "@mui/material";
import React from "react";
import { DocMsg, MediaMsg, ReplayMsg, TextMsg, Timeline } from "./MsgTypes";

const showMessage = (message, menu = false) => {
  switch (message.type) {
    case "msg":
      switch (message.subtype) {
        case "img":
          return <MediaMsg data={message} menu={menu} />;
        case "doc":
          return <DocMsg data={message} menu={menu} />;
        case "reply":
          return <ReplayMsg data={message} menu={menu} />;
        default:
          return <TextMsg data={message} menu={menu} />;
      }
    case "divider":
      return <Timeline data={message} menu={menu} />;
    default:
      <></>;
  }
};

const Message = ({ data, menu }) => {
  return (
    <Box>
      <Stack spacing={3}>{showMessage(data, menu)}</Stack>
    </Box>
  );
};

export default Message;
