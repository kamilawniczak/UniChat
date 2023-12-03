import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Switch,
  Typography,
  useTheme,
} from "@mui/material";

import {
  Bell,
  CaretRight,
  Prohibit,
  Star,
  Trash,
  X,
} from "@phosphor-icons/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ToggleSidebar,
  UpdateSidebarType,
  getChatType,
  getRoomId,
} from "../../redux/slices/app";

import { useState } from "react";
import BlockDialog from "../BlockDialog";
import DeleteDialog from "../DeleteDialog";
import { getUserId } from "../../redux/slices/auth";
import {
  UpdateDirectConversation,
  UpdateGroupConversation,
  getDirectConversations,
  getGroupConversations,
} from "../../redux/slices/conversation";
import UserCard from "./UserCard";
import UserList from "./UserList";
import { socket } from "../../socket";

const Contact = () => {
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);

  const [openBlock, setOpenBlock] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const theme = useTheme();
  const dispatch = useDispatch();

  const room_id = useSelector(getRoomId());
  const chat_type = useSelector(getChatType());
  const user_id = useSelector(getUserId());
  const direct_msgs = useSelector(getDirectConversations()).current_meessages;
  const group_msgs = useSelector(getGroupConversations()).current_meessages;

  const { conversations: directConveration } = useSelector(
    getDirectConversations()
  );
  const { conversations: groupConveration } = useSelector(
    getGroupConversations()
  );
  let current_conversation;
  let current_meessages = [];

  if (chat_type === "OneToOne") {
    current_conversation = directConveration;
    current_meessages = direct_msgs;
  }
  if (chat_type === "OneToMany") {
    current_conversation = groupConveration;
    current_meessages = group_msgs;
  }

  const selectedConversation = current_conversation?.find(
    (con) => con.id === room_id
  );
  const selectedUser = selectedConversation.user_info?.filter(
    (user) => user.id !== user_id
  );

  const about = chat_type === "OneToOne" ? selectedUser[0].about : "TODO";

  const imagesAndDocs = current_meessages
    ?.filter((msg) => msg.subtype === "img" || msg.subtype === "doc")
    ?.reduce((acc, curr) => {
      acc.push(curr.file);
      return acc;
    }, [])
    .flat();

  const handleCloseBlock = () => {
    setOpenBlock(false);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  return (
    <Box sx={{ width: 320, height: "100vh" }}>
      <Stack sx={{ height: "100%" }}>
        {/* Header */}
        <Box
          sx={{
            boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
            width: "100%",
            backgroundColor:
              theme.palette.mode === "light"
                ? "#F8FAFF"
                : theme.palette.background,
          }}
        >
          <Stack
            direction="row"
            sx={{ height: "100%" }}
            p={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography>Contact info</Typography>
            <IconButton onClick={() => dispatch(ToggleSidebar())}>
              <X />
            </IconButton>
          </Stack>
        </Box>
        {/* BODy */}
        <Stack
          sx={{
            height: "100%",
            position: "relative",
            flexGrow: 1,
            overflowY: "scroll",
          }}
          p={3}
          spacing={3}
        >
          <UserCard user={selectedUser[selectedUserIndex]} />

          {selectedUser.length > 1 && (
            <UserList
              users={selectedUser}
              selectedUserIndex={selectedUserIndex}
              setSelectedUserIndex={setSelectedUserIndex}
            />
          )}

          <Divider />
          <Stack spacing={0.5}>
            <Typography variant="article">
              {chat_type === "OneToOne" ? "About:" : "Group about:"}
            </Typography>
            {about && <Typography variant="body2">{about}</Typography>}
          </Stack>
          <Divider />
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography typography="subtitle2">Media & Docs</Typography>
            <Button
              onClick={() => dispatch(UpdateSidebarType("SHARED"))}
              endIcon={<CaretRight />}
            >
              {imagesAndDocs.length}
            </Button>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            {imagesAndDocs?.slice(0, 3)?.map((e) => (
              <Box key={e}>
                <img src={e} alt={e} />
              </Box>
            ))}
          </Stack>
          <Divider />
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Star size={26} />
              <Typography variant="subtitle2"> Started Messages</Typography>
            </Stack>
            <IconButton onClick={() => dispatch(UpdateSidebarType("STARRED"))}>
              <CaretRight />
            </IconButton>
          </Stack>
          <Divider />
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Bell size={26} />
              <Typography variant="subtitle2">Mute Notification</Typography>
            </Stack>
            <Switch
              onChange={(e) => {
                socket.emit(
                  "mute",
                  {
                    room_id,
                    user_id,
                    mute: e.target.checked,
                    chat_type,
                  },
                  () => {
                    if (chat_type === "OneToOne") {
                      dispatch(
                        UpdateDirectConversation({
                          conversation: { room_id, type: "mute" },
                        })
                      );
                    }
                    if (chat_type === "OneToMany") {
                      dispatch(
                        UpdateGroupConversation({
                          conversation: { room_id, type: "mute" },
                        })
                      );
                    }
                  }
                );
              }}
              defaultChecked={selectedConversation.isMuted}
            />
          </Stack>
          <Divider />

          <Stack direction="row" alignItems="center" spacing={2}>
            <Button
              onClick={() => setOpenBlock(true)}
              fullWidth
              variant="outlined"
              startIcon={<Prohibit />}
            >
              Blocking
            </Button>
            <Button
              onClick={() => setOpenDelete(true)}
              fullWidth
              variant="outlined"
              startIcon={<Trash />}
            >
              Delete
            </Button>
          </Stack>
        </Stack>
      </Stack>
      {openBlock && (
        <BlockDialog open={openBlock} handleClose={handleCloseBlock} />
      )}
      {openDelete && (
        <DeleteDialog open={openDelete} handleClose={handleCloseDelete} />
      )}
    </Box>
  );
};

export default Contact;
