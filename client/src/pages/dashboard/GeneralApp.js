/* eslint-disable react/jsx-pascal-case */
import { Box, Stack, Typography, useTheme } from "@mui/material";
import Chats from "./Chats";
import Conversation from "../../components/Conversation";

import { useSelector } from "react-redux";

import SVG_No_Chat from "../../assets/Illustration/NoChat";
import { getRoomId } from "../../redux/slices/conversation";
import StarredMsg from "../../components/rightSideBar/StarredMsg";
import SharedMsg from "../../components/rightSideBar/SharedMsg";
import Contact from "../../components/rightSideBar/Contact";

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

const GeneralApp = () => {
  const theme = useTheme();
  const { sideBar, chat_type } = useSelector((state) => state.app);
  const room_id = useSelector(getRoomId());

  return (
    <Stack
      direction="row"
      sx={{
        width: "100%",
      }}
    >
      <Chats />
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
        {chat_type === "OneToOne" && room_id !== null ? (
          <Conversation />
        ) : (
          <Stack
            spacing={2}
            sx={{ minHeight: "100%", width: "100%" }}
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

export default GeneralApp;
