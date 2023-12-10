import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { CaretDown, MagnifyingGlass } from "@phosphor-icons/react";
import React from "react";
import StyledBadge from "../../components/StyledBadge";
import { ToggleSidebar, getChatType, getRoomId } from "../../redux/slices/app";
import { useDispatch, useSelector } from "react-redux";
import {
  getDirectConversations,
  getGroupConversations,
} from "../../redux/slices/conversation";
import { getUserId } from "../../redux/slices/auth";

const Header = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const room_id = useSelector(getRoomId());
  const chat_type = useSelector(getChatType());
  const user_id = useSelector(getUserId());
  const { conversations: directConveration } = useSelector(
    getDirectConversations()
  );
  const { conversations: groupConveration } = useSelector(
    getGroupConversations()
  );

  const isLoading = useSelector((state) => state.coversations.isLoadingMsg);
  let current_conversation;
  let name;
  let online;

  if (chat_type === "OneToOne") {
    current_conversation = directConveration;
  }
  if (chat_type === "OneToMany") {
    current_conversation = groupConveration;
  }

  const selectedConversation = current_conversation?.find(
    (con) => con.id === room_id
  );

  const selectedUser = selectedConversation.user_info?.filter(
    (user) => user.id !== user_id
  )[0];

  const { firstName, lastName, avatar } = selectedUser || {};

  if (chat_type === "OneToOne") {
    name = `${firstName} ${lastName}`;
    online = selectedConversation.online;
  }
  if (chat_type === "OneToMany") {
    name = selectedConversation.name;
  }

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor:
          theme.palette.mode === "light"
            ? "#F8FaFF"
            : theme.palette.background.paper,
        boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
      }}
      p={2}
    >
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        sx={{ width: "100%", height: "100%" }}
      >
        <Stack
          direction="row"
          spacing={2}
          onClick={() => {
            if (!isLoading) dispatch(ToggleSidebar());
          }}
        >
          <Box>
            {online ? (
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar
                  alt={selectedConversation.img}
                  src={selectedConversation.img}
                />
              </StyledBadge>
            ) : (
              <Avatar
                alt={selectedConversation.img}
                src={selectedConversation.img}
              />
            )}
          </Box>
          {chat_type === "OneToMany" ? (
            <Stack justifyContent="center">
              <Typography
                variant="subtitle2"
                sx={{
                  fontSize: 23,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {name}
              </Typography>
            </Stack>
          ) : (
            <Stack spacing={0.2}>
              <Typography variant="subtitle2">{name}</Typography>
              <Typography variant="capiton">
                {online ? "Online" : "Offline"}
              </Typography>
            </Stack>
          )}
        </Stack>
        <Stack direction="row" alignItems="center" spacing={3}>
          <IconButton>
            <MagnifyingGlass />
          </IconButton>
          <Divider orientation="vertical" flexItem />
          <IconButton>
            <CaretDown />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Header;
