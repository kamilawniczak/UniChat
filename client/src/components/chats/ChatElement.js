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
import StyledBadge from "../StyledBadge";
import { useDispatch, useSelector } from "react-redux";
import { SelectRoom, getRoomId } from "../../redux/slices/app";
import {
  SetConversation,
  SetGroupConversation,
  UpdateDirectConversation,
  UpdateGroupConversation,
  getDirectConversations,
  getGroupConversations,
} from "../../redux/slices/conversation";
import { DotsThreeOutlineVertical, PlusCircle } from "@phosphor-icons/react";
import { useState } from "react";
import { socket } from "../../socket";
import UnblockDialog from "../UnblockDialog";
import { formatTimeDifference } from "../../utils/formatTime";

const Conversation_Menu = [
  {
    title: "Pinn",
    icon: <PlusCircle size={20} color="#c42121" weight="light" />,
  },
];

const checkText = (message, maxLength) => {
  if (message.length <= maxLength) return message;

  const slicedMessage = message.slice(0, maxLength);

  const trimmedMessage = slicedMessage.replace(/\s+$/, "");

  return trimmedMessage + "...";
};

const ChatElement = ({
  id,
  name,
  img,
  msg,
  time,
  unread,
  online,
  user_id,
  lastMessage = "",
  lastOnline,
  isGroupChat = false,
  isBlocked,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openUnBlockModal, setOpenUnBlockModal] = useState(false);
  const theme = useTheme();
  const dispatch = useDispatch();
  const open = Boolean(anchorEl);
  const this_user_id = window.localStorage.getItem("user_id");
  const room_id = useSelector(getRoomId());

  let unread_messages;

  const { unread_messages: unread_direct_messages } = useSelector(
    getDirectConversations()
  );
  const { unread_messages: unread_group_messages } = useSelector(
    getGroupConversations()
  );

  unread_messages = isGroupChat
    ? unread_group_messages
    : unread_direct_messages;

  const unread_msg = unread_messages.filter((msg) => msg.room_id === id);

  let textToShow = unread_msg?.length
    ? unread_msg[unread_msg?.length - 1].message.message
    : lastMessage;

  const handleClose = (e) => {
    if (e && e.stopPropagation && typeof e.stopPropagation === "function") {
      e.stopPropagation();
    }

    setAnchorEl(null);

    switch (e) {
      case "Pinn":
        if (!isGroupChat) {
          socket.emit(
            "pinnedConversation",
            { user_id: this_user_id, room_id: id },
            async (data) => {
              dispatch(
                UpdateDirectConversation({
                  conversation: {
                    _id: data._id,
                    type: "pinn",
                  },
                })
              );
            }
          );
        } else {
          socket.emit(
            "pinnedGroupConversation",
            { user_id: this_user_id, room_id: id },
            async (data) => {
              dispatch(
                UpdateGroupConversation({
                  conversation: {
                    _id: data._id,
                    type: "pinn",
                  },
                })
              );
            }
          );
        }
        break;

      default:
        break;
    }
  };

  const handleClick = (event) => {
    if (!isBlocked) {
      event.stopPropagation();
      setAnchorEl(event.currentTarget);
    }
  };

  return (
    <>
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
          if (isBlocked) {
            setOpenUnBlockModal(true);
          }

          if (!isBlocked && isGroupChat) {
            dispatch(SelectRoom({ room_id: id, isGroupChat: true }));
            dispatch(
              SetGroupConversation({
                user_id,
                room_id: id,
              })
            );
          } else {
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
          }
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ height: "100%" }}
        >
          <Stack direction="row" spacing={1}>
            <Stack>
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
            </Stack>

            <Stack spacing={0.3} sx={{ position: "relative" }}>
              <Typography variant="subtitle2">{checkText(name, 14)}</Typography>
              {room_id === id || (
                <Typography
                  variant="caption"
                  sx={{ position: "absolute", top: 20, whiteSpace: "nowrap" }}
                >
                  {checkText(textToShow, 17)}
                </Typography>
              )}
            </Stack>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Stack spacing={2} alignItems="center" sx={{ height: "100%" }}>
              {
                <Typography
                  sx={{ fontWeight: 600, height: 17 }}
                  variant="caption"
                >
                  {!isGroupChat &&
                    !online &&
                    user_id &&
                    formatTimeDifference(time)}
                </Typography>
              }
              <Badge color="primary" badgeContent={unread_msg.length} />
            </Stack>
            <Stack justifyContent="center">
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
                onClick={(event) => {
                  event.stopPropagation();
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
      <UnblockDialog
        open={openUnBlockModal}
        handleClose={() => setOpenUnBlockModal(false)}
        info={{
          name,
          id,
        }}
      />
    </>
  );
};
export default ChatElement;
