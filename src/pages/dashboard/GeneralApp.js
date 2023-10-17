import { Box, Stack, useTheme } from "@mui/material";
import Chats from "./Chats";
import Conversation from "../../components/Conversation";

const GeneralApp = () => {
  const theme = useTheme();
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
          width: "calc(100vw - 420px)",
          backgroundColor:
            theme.palette.mode === "light"
              ? "#F0f4fA"
              : theme.palette.background.paper,
        }}
      >
        <Conversation />
      </Box>
    </Stack>
  );
};

export default GeneralApp;
