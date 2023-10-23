import { Box, Stack, useTheme } from "@mui/material";
import Chats from "./Chats";
import Conversation from "../../components/Conversation";
import Contact from "../../components/Contact";

import { useSelector } from "react-redux";
import SharedMsg from "../../components/SharedMsg";

import StarredMsg from "../../components/StarredMsg";

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
        <Conversation />
      </Box>

      {sideBar.open && handleSidebarType(sideBar.type)}
    </Stack>
  );
};

export default GeneralApp;
