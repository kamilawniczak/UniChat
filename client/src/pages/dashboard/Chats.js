import { Box, Divider, IconButton, Stack, Typography } from "@mui/material";
import { Users } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";

import { useTheme } from "@emotion/react";

import Friends from "../../components/Friends";
import { socket } from "../../socket";
import { useDispatch, useSelector } from "react-redux";
import {
  ClearConversation,
  GetDirectConversations,
  IsLoading,
  getConversations,
  getDirectConversations,
} from "../../redux/slices/conversation";
import { ResetRoom } from "../../redux/slices/app";
import ChatCategory from "../../components/chats/ChatCategory";
import SearchInput from "../../components/chats/SearchInput";

const Chats = () => {
  const theme = useTheme();

  const [openDialog, setOpenDialog] = useState(false);

  const user_id = window.localStorage.getItem("user_id");
  const { conversations } = useSelector(getDirectConversations());
  const { isLoading } = useSelector(getConversations());
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(ClearConversation());
    dispatch(ResetRoom());
    return () => {
      dispatch(ClearConversation());
      dispatch(ResetRoom());
    };
  }, [conversations.length, dispatch]);

  useEffect(() => {
    dispatch(IsLoading(true));
    socket.emit("get_direct_conversations", { user_id }, async (data) => {
      dispatch(GetDirectConversations({ conversations: data }));
    });
  }, [user_id, dispatch]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const unpinnedConversations = conversations.filter(
    (e) => !e.isBlocked && !e.pinned
  );
  const pinnedConversations = conversations.filter(
    (e) => e.pinned && !e.isBlocked
  );
  const blockedConversations = conversations.filter((e) => e.isBlocked);

  return (
    <>
      <Box
        sx={{
          position: "relative",
          height: "100dvh",
          width: 320,
          backgroundColor:
            theme.palette.mode === "light"
              ? "#F8FAFF"
              : theme.palette.background.default,
          boxShadow: "0px 0px 2px rgba(0, 0 , 0 ,0.25)",
        }}
      >
        <Stack p={3} spacing={2} sx={{ maxHeight: "100vh" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            height={40}
          >
            <Typography variant="h5">Chats</Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconButton
                onClick={() => {
                  handleOpenDialog();
                }}
              >
                <Users />
              </IconButton>
            </Stack>
          </Stack>

          <SearchInput
            conversations={conversations.filter((e) => !e.isBlocked)}
            isGroupChat={false}
          />
          <Stack spacing={1}>
            <Divider />
          </Stack>
          <Stack
            direction="column"
            spacing={1}
            sx={{
              flexGrow: 1,
              height: "100%",
              overflow: "hidden",
            }}
          >
            <Stack
              sx={{
                overflow: "scroll",
                overflowX: "hidden",
                scrollbarGutter: "stable",
                scrollbarWidth: "normal",
              }}
              spacing={3}
            >
              <ChatCategory
                title="Pinned chats"
                conversations={pinnedConversations}
                isLoading={isLoading}
                defaultOpen={pinnedConversations?.length > 0 ? true : false}
              />
              <ChatCategory
                title="Unpinned Chats"
                conversations={unpinnedConversations}
                isLoading={isLoading}
                defaultOpen={true}
              />
              <ChatCategory
                title="Blocked chats"
                conversations={blockedConversations}
                isLoading={isLoading}
              />
            </Stack>
          </Stack>
        </Stack>
      </Box>
      {openDialog && (
        <Friends open={openDialog} handleClose={handleCloseDialog} />
      )}
    </>
  );
};

export default Chats;
