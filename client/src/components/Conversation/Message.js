import { Box, Stack } from "@mui/material";
import React from "react";
import { DocMsg, MediaMsg, ReplayMsg, TextMsg, Timeline } from "./MsgTypes";

const showMessage = (message, menu = false, members) => {
  switch (message.type) {
    case "msg":
      switch (message.subtype) {
        case "img":
          return <MediaMsg data={message} menu={menu} members={members} />;
        case "doc":
          return <DocMsg data={message} menu={menu} members={members} />;
        case "reply":
          return <ReplayMsg data={message} menu={menu} members={members} />;
        default:
          return <TextMsg data={message} menu={menu} members={members} />;
      }
    case "divider":
      return <Timeline data={message} menu={menu} />;
    default:
      <></>;
  }
};

const Message = ({ data, menu, members }) => {
  return (
    <Box>
      <Stack spacing={3}>{showMessage(data, menu, members)}</Stack>
    </Box>
  );
};

export default Message;
