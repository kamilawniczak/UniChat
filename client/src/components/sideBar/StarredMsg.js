import { Box, IconButton, Stack, Typography, useTheme } from "@mui/material";

import { CaretLeft } from "@phosphor-icons/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { UpdateSidebarType, getChatType } from "../../redux/slices/app";

import Message from "../Conversation/Message";
import {
  getDirectConversations,
  getGroupConversations,
} from "../../redux/slices/conversation";

const StarredMsg = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const chat_type = useSelector(getChatType());
  const direct_msgs = useSelector(getDirectConversations()).current_meessages;
  const group_msgs = useSelector(getGroupConversations()).current_meessages;

  let current_meessages = [];
  if (chat_type === "OneToOne") {
    current_meessages = direct_msgs;
  }
  if (chat_type === "OneToMany") {
    current_meessages = group_msgs;
  }

  return (
    <Box sx={{ width: 320, height: "100vh" }}>
      <Stack sx={{ height: "100%" }} alignItems="center">
        <Box
          sx={{
            boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
            width: "100%",
            backgroundColor:
              theme.palette.mode === "light"
                ? "#F8FAFF"
                : theme.palette.background,
          }}
        >
          <Stack
            direction="row"
            sx={{ height: "100%" }}
            p={2}
            alignItems="center"
          >
            <IconButton onClick={() => dispatch(UpdateSidebarType("CONTACT"))}>
              <CaretLeft />
            </IconButton>
            <Typography variant="subtitle2">Starred Messages</Typography>
          </Stack>
        </Box>

        <Stack
          sx={{
            height: "100%",
            width: "100%",
            position: "relative",
            flexGrow: 1,
            overflowY: "scroll",
            overflowX: "hidden",
          }}
          p={3}
          spacing={3}
        >
          {current_meessages
            ?.filter((msg) => msg.isSaved)
            ?.map((e, i) => (
              <Message data={e} key={i} avatar={false} small={true} />
            ))}
        </Stack>
      </Stack>
    </Box>
  );
};

export default StarredMsg;
