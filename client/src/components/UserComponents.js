import {
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import React from "react";
import { socket } from "../socket";
import { Chat, Trash } from "@phosphor-icons/react";
import { useDispatch } from "react-redux";
import { OpenSnackBar } from "../redux/slices/app";

const user_id = window.localStorage.getItem("user_id");

const StyledChatBox = styled(Box)(({ theme }) => ({
  "&:hover": {
    cursor: "pointer",
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const UserElement = ({ img, firstName, lastName, online, _id }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const name = `${firstName} ${lastName}`;

  return (
    <StyledChatBox
      sx={{
        width: "100%",

        borderRadius: 1,

        backgroundColor: theme.palette.background.paper,
      }}
      p={2}
    >
      <Stack
        direction="row"
        alignItems={"center"}
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems={"center"} spacing={2}>
          {online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar alt={name} src={img} />
            </StyledBadge>
          ) : (
            <Avatar alt={name} src={img} />
          )}
          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{name}</Typography>
          </Stack>
        </Stack>
        <Stack direction={"row"} spacing={2} alignItems={"center"}>
          <Button
            onClick={() => {
              socket.emit(
                "friend_request",
                { to: _id, from: user_id },
                ({ severity, message }) => {
                  dispatch(OpenSnackBar({ severity, message }));
                }
              );
            }}
          >
            Send Request
          </Button>
        </Stack>
      </Stack>
    </StyledChatBox>
  );
};

const FriendElement = ({ img, firstName, lastName, online, _id }) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const name = `${firstName} ${lastName}`;

  return (
    <StyledChatBox
      sx={{
        width: "100%",

        borderRadius: 1,

        backgroundColor: theme.palette.background.paper,
      }}
      p={2}
    >
      <Stack
        direction="row"
        alignItems={"center"}
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems={"center"} spacing={2}>
          {online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar alt={name} src={img} />
            </StyledBadge>
          ) : (
            <Avatar alt={name} src={img} />
          )}
          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{name}</Typography>
          </Stack>
        </Stack>
        <Stack direction={"row"} spacing={1} alignItems={"center"}>
          <IconButton
            onClick={() => {
              socket.emit("start_conversation", { to: _id, from: user_id });
            }}
          >
            <Chat />
          </IconButton>
          <IconButton
            onClick={() => {
              socket.emit(
                "removeFriend",
                { to: _id, from: user_id },
                ({ severity, message }) => {
                  dispatch(OpenSnackBar({ severity, message }));
                }
              );
            }}
          >
            <Trash color="#f63737" />
          </IconButton>
        </Stack>
      </Stack>
    </StyledChatBox>
  );
};
const FriendRequestElement = ({
  img,
  firstName,
  lastName,
  incoming,
  missed,
  online,
  id,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const name = `${firstName} ${lastName}`;

  return (
    <StyledChatBox
      sx={{
        width: "100%",

        borderRadius: 1,

        backgroundColor: theme.palette.background.paper,
      }}
      p={2}
    >
      <Stack
        direction="row"
        alignItems={"center"}
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems={"center"} spacing={2}>
          {online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar alt={name} src={img} />
            </StyledBadge>
          ) : (
            <Avatar alt={name} src={img} />
          )}
          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{name}</Typography>
          </Stack>
        </Stack>
        <Stack direction={"row"} spacing={2} alignItems={"center"}>
          <Button
            onClick={() => {
              socket.emit(
                "accept_request",
                { request_id: id },
                ({ severity, message }) => {
                  dispatch(OpenSnackBar({ severity, message }));
                }
              );
            }}
          >
            Accept Request
          </Button>
        </Stack>
      </Stack>
    </StyledChatBox>
  );
};

export { FriendElement, UserElement, FriendRequestElement };
