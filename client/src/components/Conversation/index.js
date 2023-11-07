import React, { useEffect, useRef } from "react";

import Header from "./Header";
import Chat from "./Chat";
import Footer from "./Footer";
import { Box, Stack } from "@mui/material";
import { useSelector } from "react-redux";
import { getDirectConversations } from "../../redux/slices/conversation";

const Conversation = () => {
  const scrollRef = useRef(null);
  const { current_meessages } = useSelector(getDirectConversations());

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [current_meessages]);

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
        ref={scrollRef}
      >
        <Chat />
      </Box>
      <Footer />
    </Stack>
  );
};

export default Conversation;
