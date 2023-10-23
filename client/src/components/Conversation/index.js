import React from "react";

import Header from "./Header";
import Chat from "./Chat";
import Footer from "./Footer";
import { Box, Stack } from "@mui/material";

const Conversation = () => {
  return (
    <Stack sx={{ height: "100%", maxHeight: "100vh", width: "auto" }}>
      <Header />
      <Box
        sx={{
          width: "100%",
          flexGrow: 1,
          overflowY: "auto",
          scrollbarGutter: "stable",
        }}
      >
        <Chat />
      </Box>
      <Footer />
    </Stack>
  );
};

export default Conversation;
