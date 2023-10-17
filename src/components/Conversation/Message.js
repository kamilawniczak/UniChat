import { Box, Divider, Stack } from "@mui/material";
import React from "react";
import {
  DocMsg,
  LinkMsg,
  MediaMsg,
  ReplayMsg,
  TextMsg,
  Timeline,
} from "./MsgTypes";

const showMessage = (message) => {
  switch (message.type) {
    case "msg":
      switch (message.subtype) {
        case "img":
          return <MediaMsg data={message} />;
        case "doc":
          return <DocMsg data={message} />;
        case "link":
          return <LinkMsg data={message} />;
        case "reply":
          return <ReplayMsg data={message} />;
        default:
          return <TextMsg data={message} />;
      }
    case "divider":
      return <Timeline data={message} />;
    default:
      <></>;
  }
};

const Message = ({ data }) => {
  return (
    <Box>
      <Stack spacing={3}>{showMessage(data)}</Stack>
    </Box>
  );
};

export default Message;
