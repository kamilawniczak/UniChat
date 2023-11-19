import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { CircleDashed, MagnifyingGlass, Users } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";

import { useTheme } from "@emotion/react";

import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Search/index";
import ChatElement from "../../components/ChatElement";
import Friends from "../../sections/main/Friends";
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

const Chats = () => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);

  const user_id = window.localStorage.getItem("user_id");
  const { conversations } = useSelector(getDirectConversations());
  const { isLoading } = useSelector(getConversations());
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(ClearConversation());
    return () => {
      dispatch(ClearConversation());
      dispatch(ResetRoom());
    };
  }, [conversations.length]);

  useEffect(() => {
    dispatch(IsLoading(true));
    socket.emit("get_direct_conversations", { user_id }, async (data) => {
      dispatch(GetDirectConversations({ conversations: data }));
      dispatch(IsLoading(false));
    });
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
        <Stack p={3} spacing={2} sx={{ height: "100%" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
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
              <IconButton>
                <CircleDashed />
              </IconButton>
            </Stack>
          </Stack>
          <Stack sx={{ width: "100%" }}>
            <Stack sx={{ position: "relative" }}>
              <Search>
                <SearchIconWrapper>
                  <MagnifyingGlass color="#709CE6" />
                </SearchIconWrapper>
                <StyledInputBase placeholder="Search..." />
              </Search>
            </Stack>
          </Stack>
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
                    <ChatElement {...e} key={e.id} />
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
                    return <ChatElement {...e} key={e.id} />;
                  })}
                {isLoading && (
                  <Stack justifyContent="center" alignItems="center">
                    <CircularProgress color="success" />
                  </Stack>
                )}
              </Stack>
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
