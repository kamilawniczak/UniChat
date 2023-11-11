import React, { useEffect } from "react";
import {
  Box,
  Divider,
  IconButton,
  Link,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Search/index";
import { MagnifyingGlass, Plus } from "@phosphor-icons/react";
import ChatElement from "../../components/ChatElement";
import CreateGroup from "../../sections/main/CreateGroup";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  GetGroupConversations,
  IsLoading,
  getConversations,
  getGroupConversations,
} from "../../redux/slices/conversation";
import { socket } from "../../socket";
import { getUserId } from "../../redux/slices/auth";

const Group = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const theme = useTheme();
  const { conversations } = useSelector(getGroupConversations());
  const dispatch = useDispatch();
  const { isLoading } = useSelector(getConversations());
  const user_id = useSelector(getUserId());

  useEffect(() => {
    dispatch(IsLoading(true));
    socket.emit("get_group_conversations", { user_id }, async (data) => {
      console.log(data);
      dispatch(GetGroupConversations({ conversations: data }));
      dispatch(IsLoading(false));
    });

    // return () => {
    //   dispatch(ClearConversation());
    // };
  }, [user_id, dispatch]);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const notPinnedConversations = conversations.filter((e) => !e.pinned);
  const pinnedConversations = conversations.filter((e) => e.pinned);

  return (
    <>
      <Stack direction="row" sx={{ width: "100%" }}>
        <Box
          sx={{
            height: "100vh",
            backgroundColor: (them) =>
              them.palette.mode === "light"
                ? "F8FAFF"
                : them.palette.background,
            width: 320,
            boxShadow: "0px 0px 2px rgba(0,0,0,.25)",
          }}
        >
          <Stack p={3} spacing={2} sx={{ maxHeight: "100vh" }}>
            <Stack>
              <Typography variant="h5">Groups</Typography>
            </Stack>
            <Stack sx={{ width: "100%" }}>
              <Search>
                <SearchIconWrapper>
                  <MagnifyingGlass color="#709CE6" />
                </SearchIconWrapper>
                <StyledInputBase placeholder="Search..." />
              </Search>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="subtitle2" component={Link}>
                Create New Group
              </Typography>
              <IconButton onClick={() => setOpenDialog(true)}>
                <Plus style={{ color: theme.palette.primary.main }} />
              </IconButton>
            </Stack>
            <Divider />
            <Stack
              sx={{
                flexGrow: 1,
                height: "100%",
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
                {pinnedConversations.map((e) => (
                  <ChatElement {...e} key={e.id} />
                ))}
              </Stack>
              <Stack spacing={2.4}>
                <Typography variant="subtitle2" sx={{ color: "#676767" }}>
                  All Groups
                </Typography>
                {notPinnedConversations.map((e) => (
                  <ChatElement {...e} key={e.id} />
                ))}
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Stack>
      {openDialog && (
        <CreateGroup open={openDialog} handleClose={handleCloseDialog} />
      )}
    </>
  );
};

export default Group;
