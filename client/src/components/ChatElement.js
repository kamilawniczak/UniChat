import {
  Avatar,
  Badge,
  Box,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import StyledBadge from "./StyledBadge";
import { useDispatch } from "react-redux";
import { OpenSnackBar, SelectRoom } from "../redux/slices/app";
import {
  DeleteDirectConversation,
  SetConversation,
  UpdateDirectConversation,
} from "../redux/slices/conversation";
import {
  DotsThreeOutlineVertical,
  PlusCircle,
  Trash,
} from "@phosphor-icons/react";
import { useState } from "react";
import { socket } from "../socket";

const Conversation_Menu = [
  {
    title: "Delete",
    icon: <Trash size={20} color="#c42121" weight="light" />,
  },
  {
    title: "Pinn",
    icon: <PlusCircle size={20} color="#c42121" weight="light" />,
  },
];

const checkMessage = (message) => {
  if (message.length < 20) return message;
  return message.split("").slice(0, 20).join("") + "...";
};

const ChatElement = ({ id, name, img, msg, time, unread, online, user_id }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const this_user_id = window.localStorage.getItem("user_id");

  const handleClose = (e) => {
    setAnchorEl(null);

    switch (e) {
      case "Delete":
        socket.emit("deleteConversation", { room_id: id }, async (data) => {
          dispatch(
            OpenSnackBar({
              severity: "success",
              message: data.message,
            })
          );
          dispatch(DeleteDirectConversation({ room_id: data.room_id }));
        });
        break;
      case "Pinn":
        socket.emit(
          "pinnedConversation",
          { user_id: this_user_id, room_id: id },
          async (data) => {
            dispatch(UpdateDirectConversation({ conversation: data }));
          }
        );
        break;

      default:
        break;
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: 1,
        backgroundColor:
          theme.palette.mode === "light"
            ? "#FFF"
            : theme.palette.background.paper,
      }}
      p={1.4}
      onClick={() => {
        dispatch(SelectRoom({ room_id: id }));
        dispatch(
          SetConversation({
            user_id,
            room_id: id,
            userInfo: {
              name,
              online: online,
            },
          })
        );
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ height: "100%" }}
      >
        <Stack direction="row" spacing={1}>
          {online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar src={img} />
            </StyledBadge>
          ) : (
            <Avatar src={img} />
          )}

          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{name}</Typography>{" "}
            <Typography variant="caption">{checkMessage(msg)}</Typography>
          </Stack>
        </Stack>
        <Stack spacing={2} alignItems="center">
          <Typography sx={{ fontWeight: 600 }} variant="caption">
            {time}
          </Typography>
          <Badge color="primary" badgeContent={unread} />
        </Stack>
        <Stack>
          <DotsThreeOutlineVertical
            size={22}
            color="#c42121"
            weight="light"
            id="account-menu"
            aria-controls={open ? "demo-positioned-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          />
        </Stack>
      </Stack>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            ml: 2,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              bottom: 24,
              left: 0,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translate(-50%, 50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "left", vertical: "bottom" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Stack spacing={1} px={1}>
          {Conversation_Menu.map((e, i) => (
            <MenuItem
              onClick={() => {
                handleClose(e.title);
              }}
              key={i}
            >
              <Stack
                sx={{ width: 100 }}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <span>{e.title}</span>
                {e.icon}
              </Stack>
            </MenuItem>
          ))}
        </Stack>
      </Menu>
    </Box>
  );
};
export default ChatElement;
