import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { MagnifyingGlass, Plus } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";

import { useTheme } from "@emotion/react";

import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Search/index";
import ChatElement from "../../components/ChatElement";
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
import CreateGroup from "../../sections/main/CreateGroup";

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
  }, [conversations.length]);

  useEffect(() => {
    dispatch(IsLoading(true));
    socket.emit("get_group_conversations", { user_id }, async (data) => {
      dispatch(GetGroupConversations({ conversations: data }));
      dispatch(IsLoading(false));
    });

    // return () => {
    //   dispatch(ClearConversation());
    // };
  }, [user_id, dispatch]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const notPinnedConversations = conversations.filter((e) => !e.pinned);
  const pinnedConversations = conversations.filter((e) => e.pinned);

  return (
    <>
      <Box
        sx={{
          overflowY: "scroll",

          height: "100vh",
          width: 320,
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? "#F8FAFF"
              : theme.palette.background,

          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}
      >
        <Stack p={3} spacing={2} sx={{ maxHeight: "100vh" }}>
          <Stack
            alignItems={"center"}
            justifyContent="space-between"
            direction="row"
          >
            <Typography variant="h5">Groups</Typography>
          </Stack>
          <Stack sx={{ width: "100%" }}>
            <Search>
              <SearchIconWrapper>
                <MagnifyingGlass color="#709CE6" />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
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
          <Stack sx={{ flexGrow: 1, height: "100%", overflow: "auto" }}>
            <Stack spacing={2.4}>
              {isLoading && (
                <Typography variant="subtitle2" sx={{ color: "#676767" }}>
                  Pinned
                </Typography>
              )}
              {!isLoading &&
                (pinnedConversations.length === 0 || (
                  <Typography variant="subtitle2" sx={{ color: "#676767" }}>
                    Pinned
                  </Typography>
                ))}
              {isLoading ||
                pinnedConversations.map((e) => (
                  <ChatElement {...e} key={e.id} isGroupChat={true} />
                ))}
              {isLoading && (
                <Stack justifyContent="center" alignItems="center">
                  <CircularProgress color="success" />
                </Stack>
              )}
            </Stack>
            <Stack spacing={2.4}>
              <Typography variant="subtitle2" sx={{ color: "#676767" }}>
                All Chats
              </Typography>

              {isLoading ||
                (notPinnedConversations.length === 0 && (
                  <Typography>No chats</Typography>
                ))}
              {isLoading ||
                notPinnedConversations.map((e) => {
                  return <ChatElement {...e} key={e.id} isGroupChat={true} />;
                })}
              {isLoading && (
                <Stack justifyContent="center" alignItems="center">
                  <CircularProgress color="success" />
                </Stack>
              )}
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
