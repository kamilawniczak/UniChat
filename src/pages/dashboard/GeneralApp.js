import { Box, Stack, useTheme } from "@mui/material";
import Chats from "./Chats";
import Conversation from "../../components/Conversation";
import Contact from "../../components/Contact";
import { getIsOpened } from "../../redux/slices/app";
import { useSelector } from "react-redux";

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

      {sideBar.open && <Contact />}
    </Stack>
  );
};

export default GeneralApp;
