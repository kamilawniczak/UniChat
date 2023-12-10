import { Box, Divider, IconButton, Stack, Typography } from "@mui/material";
import { Plus } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";

import { useTheme } from "@emotion/react";

import { socket } from "../../socket";
import { useDispatch, useSelector } from "react-redux";
import {
  ClearGroupConversation,
  GetGroupConversations,
  IsLoading,
  getConversations,
  getGroupConversations,
} from "../../redux/slices/conversation";
import { ResetRoom } from "../../redux/slices/app";
import CreateGroup from "../../components/CreateGroup";
import ChatCategory from "../../components/chats/ChatCategory";
import SearchInput from "../../components/chats/SearchInput";

const GroupChat = () => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);

  const user_id = window.localStorage.getItem("user_id");
  const { conversations } = useSelector(getGroupConversations());
  const { isLoading } = useSelector(getConversations());
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(ClearGroupConversation());
    dispatch(ResetRoom());
    return () => {
      dispatch(ClearGroupConversation());
      dispatch(ResetRoom());
    };
  }, [conversations.length, dispatch]);

  useEffect(() => {
    dispatch(IsLoading(true));
    socket.emit("get_group_conversations", { user_id }, async (data) => {
      dispatch(GetGroupConversations({ conversations: data }));
      dispatch(IsLoading(false));
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
            alignItems={"center"}
            justifyContent="space-between"
            direction="row"
            height={40}
          >
            <Typography variant="h5">Groups</Typography>
          </Stack>
          <Stack sx={{ width: "100%" }}>
            <SearchInput
              conversations={conversations.filter((e) => !e.isBlocked)}
              isGroupChat={true}
            />
          </Stack>
          <Stack
            justifyContent={"space-between"}
            alignItems={"center"}
            direction={"row"}
          >
            <Typography
              variant="subtitle2"
              sx={{ color: theme.palette.primary.main }}
            >
              Create New Group
            </Typography>
            <IconButton onClick={handleOpenDialog}>
              <Plus style={{ color: theme.palette.primary.main }} />
            </IconButton>
          </Stack>
          <Divider />
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
                isGroupChat={true}
                defaultOpen={pinnedConversations?.length > 0 ? true : false}
              />

              <ChatCategory
                title="Unpinned Chats"
                conversations={unpinnedConversations}
                isLoading={isLoading}
                isGroupChat={true}
                defaultOpen={true}
              />
              <ChatCategory
                title="Blocked chats"
                conversations={blockedConversations}
                isLoading={isLoading}
                isGroupChat={true}
              />
            </Stack>
          </Stack>
        </Stack>
      </Box>

      {openDialog && (
        <CreateGroup open={openDialog} handleClose={handleCloseDialog} />
      )}
    </>
  );
};

export default GroupChat;
