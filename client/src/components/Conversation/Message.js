import { Box, Stack } from "@mui/material";
import React from "react";
import { DocMsg, MediaMsg, TextMsg, Timeline } from "./MsgTypes";
import { useSelector } from "react-redux";
import { getChatType, getRoomId } from "../../redux/slices/app";
import { getGroupRoomId } from "../../redux/slices/conversation";

const showMessage = (
  message,
  menu = false,
  members,
  room_id,
  chat_type,
  avatar,
  small
) => {
  switch (message.type) {
    case "msg":
      switch (message.subtype) {
        case "img":
          return (
            <MediaMsg
              data={message}
              menu={menu}
              showAvatar={avatar}
              members={members}
              room_id={room_id}
              conversationType={chat_type}
            />
          );
        case "doc":
          return (
            <DocMsg
              data={message}
              menu={menu}
              showAvatar={avatar}
              small={small}
              members={members}
              room_id={room_id}
              conversationType={chat_type}
            />
          );
        default:
          return (
            <TextMsg
              data={message}
              menu={menu}
              showAvatar={avatar}
              members={members}
              room_id={room_id}
              conversationType={chat_type}
            />
          );
      }
    case "divider":
      return <Timeline data={message} menu={menu} />;
    default:
      return;
  }
};

const Message = ({ data, menu, members, avatar = true, small = false }) => {
  const direct_room = useSelector(getRoomId());
  const group_room = useSelector(getGroupRoomId());
  const chat_type = useSelector(getChatType());

  const room_id = direct_room || group_room;

  return (
    <Box>
      <Stack spacing={3}>
        {showMessage(data, menu, members, room_id, chat_type, avatar, small)}
      </Stack>
    </Box>
  );
};

export default Message;
