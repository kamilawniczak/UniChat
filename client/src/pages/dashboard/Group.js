/* eslint-disable react/jsx-pascal-case */
import { Box, Stack, Typography, useTheme } from "@mui/material";

import Conversation from "../../components/Conversation";
import Contact from "../../components/Contact";

import { useSelector } from "react-redux";
import SharedMsg from "../../components/SharedMsg";

import StarredMsg from "../../components/StarredMsg";

import SVG_No_Chat from "../../assets/Illustration/NoChat";
import { getGroupRoomId } from "../../redux/slices/conversation";
import GroupChat from "./GroupChat";

const handleSidebarType = (type) => {
  switch (type) {
    case "CONTACT":
      return <Contact />;
    case "STARRED":
      return <StarredMsg />;
    case "SHARED":
      return <SharedMsg />;
    default:
      break;
  }
};

const Group = () => {
  const theme = useTheme();
  const { sideBar, chat_type } = useSelector((state) => state.app);
  const room_id = useSelector(getGroupRoomId());

  return (
    <Stack
      direction="row"
      sx={{
        width: "100%",
      }}
    >
      <GroupChat />
      <Box
        sx={{
          height: "`100%",
          width: sideBar.open
            ? "calc(100vw - 420px - 320px)"
            : "calc(100vw - 420px)",
          backgroundColor:
            theme.palette.mode === "light"
              ? "#F0f4fA"
              : theme.palette.background.paper,
        }}
      >
        {chat_type === "OneToMany" && room_id !== null ? (
          <Conversation />
        ) : (
          <Stack
            spacing={2}
            sx={{ height: "100vh", width: "100%" }}
            alignItems="center"
            justifyContent="center"
          >
            <SVG_No_Chat />
            <Typography variant="subtitle2">
              Select a conversation or start a new one
            </Typography>
          </Stack>
        )}
      </Box>

      {sideBar.open && handleSidebarType(sideBar.type)}
    </Stack>
  );
};

export default Group;
