import { Box, Stack, Typography, useTheme } from "@mui/material";
import Chats from "./Chats";
import Conversation from "../../components/Conversation";
import Contact from "../../components/Contact";

import { useSelector } from "react-redux";
import SharedMsg from "../../components/SharedMsg";

import StarredMsg from "../../components/StarredMsg";
import { getChatType, getRoomId } from "../../redux/slices/app";

import SVG_No_Chat from "../../assets/Illustration/NoChat";

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
  const { sideBar } = useSelector((store) => store.app);

  const room_id = useSelector(getRoomId());
  const chat_type = useSelector(getChatType());

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

export default GeneralApp;
