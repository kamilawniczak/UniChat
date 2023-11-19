import React, { useEffect, useRef } from "react";

import Header from "./Header";
import Chat from "./Chat";
import Footer from "./Footer";
import { Box, Stack } from "@mui/material";
import { useSelector } from "react-redux";
import {
  getDirectConversations,
  getGroupConversations,
} from "../../redux/slices/conversation";

const Conversation = () => {
  const scrollRef = useRef(null);
  const { current_meessages: direct_msgs } = useSelector(
    getDirectConversations()
  );
  const { current_meessages: group_msgs } = useSelector(
    getGroupConversations()
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [direct_msgs, group_msgs]);

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
