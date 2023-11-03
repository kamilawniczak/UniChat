import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import {
  ArchiveBox,
  CircleDashed,
  MagnifyingGlass,
  Users,
} from "@phosphor-icons/react";
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
import { getUserId } from "../../redux/slices/auth";
import {
  GetCurrentMessages,
  GetDirectConversations,
  getDirectConversations,
} from "../../redux/slices/conversation";

const Chats = () => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const user_id = window.localStorage.getItem("user_id");
  const { conversations } = useSelector(getDirectConversations());
  const dispatch = useDispatch();

  useEffect(() => {
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
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <ArchiveBox size={24} />
              <Button>Archive</Button>
            </Stack>
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
                <Typography variant="subtitle2" sx={{ color: "#676767" }}>
                  Pinned
                </Typography>
                {conversations
                  .filter((e) => e.pinned)
                  .map((e) => (
                    <ChatElement {...e} key={e.id} />
                  ))}
              </Stack>
              <Stack spacing={2.4}>
                <Typography variant="subtitle2" sx={{ color: "#676767" }}>
                  All Chats
                </Typography>
                {conversations
                  .filter((e) => !e.pinned)
                  .map((e) => {
                    return <ChatElement {...e} key={e.id} />;
                  })}
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
